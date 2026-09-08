import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Database connection ──
const pool = new pg.Pool({
  host:     process.env.DB_HOST,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port:     5432,
  ssl:      { rejectUnauthorized: false }
});

const EMBED_MODEL = "openai/text-embedding-3-small";

/**
 * Generate and store an embedding for a passage in the database.
 */
async function getEmbed(topic_name, context, example_question) {
    const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: EMBED_MODEL,
            input: `Topic: ${topic_name}. Context: ${context}. Example: ${example_question}`,
        }),
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Embedding API error ${response.status}: ${err}`);
    }
    const data = await response.json();
    const embedding = data.data[0].embedding;
    const vector_string = JSON.stringify(embedding);

    await pool.query("UPDATE engr102topics SET embedding = $1 WHERE topic_name = $2", [vector_string, topic_name]);
    return embedding;
}

/**
 * Embed a query string for RAG retrieval (no DB write).
 * Uses openai/text-embedding-3-small (1536 dimensions).
 * @param {string} queryText - plain text to embed (e.g. "chapter 4 conditionals")
 * @returns {number[]} embedding vector
 */
export async function embedQuery(queryText) {
    const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: EMBED_MODEL,
            input: queryText,
        }),
    });
    if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Embedding API error ${response.status}: ${errBody}`);
    }
    const data = await response.json();
    return data.data[0].embedding;
}

/**
 * Parse topics.csv with support for multiline quoted fields.
 */
function loadTopicsFromCSV() {
    const csvPath = path.join(__dirname, "topics.csv");
    if (!fs.existsSync(csvPath)) return [];

    const text = fs.readFileSync(csvPath, "utf8");
    const rows = [];
    let row = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const next = text[i + 1];

        if (char === '"') {
            if (inQuotes && next === '"') {
                cur += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === "," && !inQuotes) {
            row.push(cur.trim());
            cur = "";
        } else if ((char === "\r" || char === "\n") && !inQuotes) {
            if (char === "\r" && next === "\n") i++;
            row.push(cur.trim());
            if (row.some(f => f.length > 0)) rows.push(row);
            row = [];
            cur = "";
        } else {
            cur += char;
        }
    }
    if (cur.length > 0 || row.length > 0) {
        row.push(cur.trim());
        if (row.some(f => f.length > 0)) rows.push(row);
    }

    if (rows.length < 2) return [];

    return rows.slice(1).map(r => ({
        chapter: parseInt(r[0]),
        topic: parseInt(r[1]),
        topic_name: r[2],
        context: r[3] || "",
        question: r[4] || "",
        other_instruction: r[5] || ""
    })).filter(t => !isNaN(t.chapter) && !isNaN(t.topic));
}

/**
 * Embed a single topic and sync its text from topics.csv into the database.
 * @param {string|number} chap - Chapter number or topic name/key
 * @param {number} [top] - Topic number within the chapter
 */
async function embedSingleTopic(chap, top) {
    let target = null;
    const csvTopics = loadTopicsFromCSV();

    // 1. Try matching by chapter and topic number
    if (top !== undefined && !isNaN(chap) && !isNaN(top)) {
        const chNum = parseInt(chap);
        const tpNum = parseInt(top);
        target = csvTopics.find(t => t.chapter === chNum && t.topic === tpNum);

        if (!target) {
            const dbRes = await pool.query(
                "SELECT chapter, topic, topic_name, context, question, other_instruction FROM engr102topics WHERE chapter = $1 AND topic = $2",
                [chNum, tpNum]
            );
            if (dbRes.rows.length > 0) target = dbRes.rows[0];
        }
    } else {
        // Match by string (e.g. "1.3", "1 3", or "Resulting Data Type")
        const queryStr = String(chap).trim();
        const dotMatch = queryStr.match(/^(\d+)[\s.]+(\d+)$/);
        if (dotMatch) {
            const chNum = parseInt(dotMatch[1]);
            const tpNum = parseInt(dotMatch[2]);
            target = csvTopics.find(t => t.chapter === chNum && t.topic === tpNum);
            if (!target) {
                const dbRes = await pool.query(
                    "SELECT chapter, topic, topic_name, context, question, other_instruction FROM engr102topics WHERE chapter = $1 AND topic = $2",
                    [chNum, tpNum]
                );
                if (dbRes.rows.length > 0) target = dbRes.rows[0];
            }
        } else {
            // Match by topic name (case-insensitive)
            target = csvTopics.find(t => t.topic_name.toLowerCase() === queryStr.toLowerCase())
                  || csvTopics.find(t => t.topic_name.toLowerCase().includes(queryStr.toLowerCase()));

            if (!target) {
                const dbRes = await pool.query(
                    "SELECT chapter, topic, topic_name, context, question, other_instruction FROM engr102topics WHERE LOWER(topic_name) LIKE LOWER($1) LIMIT 1",
                    [`%${queryStr}%`]
                );
                if (dbRes.rows.length > 0) target = dbRes.rows[0];
            }
        }
    }

    if (!target) {
        console.error(`\n❌ Topic not found for input: "${chap}${top !== undefined ? ' ' + top : ''}".`);
        return false;
    }

    console.log(`\nFound Topic: Chapter ${target.chapter}, Topic ${target.topic} - "${target.topic_name}"`);
    console.log(`Context preview: ${target.context.slice(0, 90).replace(/\s+/g, ' ')}...`);

    // Sync context, question, and other_instruction to PostgreSQL so topics.csv edits take effect
    if (target.context) {
        await pool.query(
            `UPDATE engr102topics 
             SET context = $1, question = $2, other_instruction = $3 
             WHERE chapter = $4 AND topic = $5`,
            [target.context, target.question, target.other_instruction, target.chapter, target.topic]
        );
        console.log(`✓ Synced latest context and question to PostgreSQL.`);
    }

    // Generate embedding and save to database
    console.log(`Generating embedding with ${EMBED_MODEL}...`);
    await getEmbed(target.topic_name, target.context, target.question);
    console.log(`✅ Successfully embedded Chapter ${target.chapter}, Topic ${target.topic}: "${target.topic_name}" into the database!\n`);
    return true;
}

/**
 * Re-embed all topics from topics.csv and database.
 */
async function reembedAllTopics() {
    console.log(`\nStarting full re-embedding with ${EMBED_MODEL}...`);
    const csvTopics = loadTopicsFromCSV();

    // Also get all topics in DB to catch any non-CSV entries (e.g. exam1, exam2)
    const dbRes = await pool.query("SELECT chapter, topic, topic_name, context, question, other_instruction FROM engr102topics ORDER BY chapter, topic");
    const allTopics = dbRes.rows;

    console.log(`Found ${allTopics.length} topics in database.\n`);

    for (let i = 0; i < allTopics.length; i++) {
        const item = allTopics[i];
        // If present in CSV, sync latest text first
        const fromCSV = csvTopics.find(c => c.chapter === item.chapter && c.topic === item.topic);
        const context = fromCSV?.context || item.context || "";
        const question = fromCSV?.question || item.question || "";
        const other_instruction = fromCSV?.other_instruction || item.other_instruction || "";

        if (fromCSV) {
            await pool.query(
                `UPDATE engr102topics 
                 SET context = $1, question = $2, other_instruction = $3 
                 WHERE chapter = $4 AND topic = $5`,
                [context, question, other_instruction, item.chapter, item.topic]
            );
        }

        console.log(`[${i + 1}/${allTopics.length}] Embedding Chapter ${item.chapter}.${item.topic}: "${item.topic_name}"`);
        await getEmbed(item.topic_name, context, question);
    }

    console.log(`\n✅ All ${allTopics.length} topics successfully synced and embedded with ${EMBED_MODEL}!\n`);
}

/**
 * Interactive menu when run directly in the terminal without arguments.
 */
async function interactiveCLI() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const ask = (query) => new Promise(resolve => rl.question(query, resolve));

    console.log("\n=========================================");
    console.log("       ENGR 102 TOPIC EMBEDDING TOOL      ");
    console.log("=========================================");
    console.log("  1) Embed a single topic (e.g. 1.3 or 'Resulting Data Type')");
    console.log("  2) Embed ALL topics");
    console.log("  3) Exit");
    console.log("=========================================");

    const choice = (await ask("\nEnter choice (1, 2, or 3): ")).trim();

    if (choice === "1") {
        const topicInput = await ask("Enter chapter & topic (e.g. '1 3' or '1.3') or topic name: ");
        rl.close();
        const parts = topicInput.trim().split(/\s+/);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            await embedSingleTopic(parts[0], parts[1]);
        } else {
            await embedSingleTopic(topicInput.trim());
        }
    } else if (choice === "2") {
        const confirm = await ask("Are you sure you want to re-embed all 54 topics? (y/N): ");
        rl.close();
        if (confirm.trim().toLowerCase() === "y") {
            await reembedAllTopics();
        } else {
            console.log("Operation cancelled.");
        }
    } else {
        console.log("Exiting.");
        rl.close();
    }

    await pool.end();
}

// ── CLI argument handling ──
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        // No args: start interactive menu
        interactiveCLI().catch(err => {
            console.error("Error:", err);
            pool.end();
            process.exit(1);
        });
    } else if (args[0] === "all" || args[0] === "--all") {
        // e.g. node embed.js all
        reembedAllTopics()
            .then(() => pool.end())
            .catch(err => {
                console.error("Error:", err);
                pool.end();
                process.exit(1);
            });
    } else if (args.length >= 2 && !isNaN(args[0]) && !isNaN(args[1])) {
        // e.g. node embed.js 1 3
        embedSingleTopic(args[0], args[1])
            .then(() => pool.end())
            .catch(err => {
                console.error("Error:", err);
                pool.end();
                process.exit(1);
            });
    } else {
        // e.g. node embed.js 1.3 OR node embed.js "Resulting Data Type"
        embedSingleTopic(args.join(" "))
            .then(() => pool.end())
            .catch(err => {
                console.error("Error:", err);
                pool.end();
                process.exit(1);
            });
    }
}