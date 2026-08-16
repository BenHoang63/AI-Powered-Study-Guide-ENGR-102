import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import readline from "readline";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));


// ── database connection ──
const pool = new pg.Pool({
  host:     process.env.DB_HOST,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port:     5432,
  ssl:      { rejectUnauthorized: false }
});


async function getEmbed(topic_name, context, example_question) {
    const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'nvidia/nemotron-3-embed-1b:free',
            input: `passage: Topic: ${topic_name}. Context: ${context}. Example: ${example_question}`,
        }),
    });
    const data = await response.json();
    const embedding = data.data[0].embedding;
    const vector_string = JSON.stringify(embedding);

    const result = await pool.query("UPDATE engr102topics SET embedding = $1 WHERE topic_name = $2", [vector_string,topic_name]);
    return embedding;
}

/**
 * Embed a query string for RAG retrieval (no DB write).
 * Uses the same model as the passage embeddings so distances are comparable.
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
            model: 'nvidia/nemotron-3-embed-1b:free',
            input: `query: ${queryText}`,
        }),
    });
    if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Embedding API error ${response.status}: ${errBody}`);
    }
    const data = await response.json();
    return data.data[0].embedding;
}



// Simple CSV row parser that handles quoted fields with embedded commas/newlines.
function parseCSVLine(line) {
    const fields = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                // Escaped double-quote inside quoted field
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === "," && !inQuotes) {
            fields.push(current);
            current = "";
        } else {
            current += ch;
        }
    }
    fields.push(current);
    return fields;
}

async function processTopicsCSV() {
    const csvPath = path.join(__dirname, "topics.csv");
    const fileStream = fs.createReadStream(csvPath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let isHeader = true;
    let buffer = "";       // accumulates a logical (possibly multi-line) CSV row
    let inQuotes = false;

    for await (const line of rl) {
        // Track whether we're inside a quoted field across line boundaries
        for (const ch of line) {
            if (ch === '"') inQuotes = !inQuotes;
        }

        buffer += (buffer ? "\n" : "") + line;

        // Only process the row once we've closed all quoted fields
        if (!inQuotes) {
            if (isHeader) {
                isHeader = false;
            } else {
                const fields = parseCSVLine(buffer);
                // columns: chapter, topic, topic_name, context, question, other_instruction
                const [chapter, topic, topic_name, context, question] = fields;
                if (topic_name && context && question) {
                    console.log(`Embedding: ${topic_name}`);
                    await getEmbed(topic_name, context, question);
                }
            }
            buffer = "";
        }
    }

    console.log("All embeddings complete.");
    await pool.end();
}

// Only run the CSV seeding script when this file is executed directly
// (e.g. `node embed.js`), not when imported by server.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    processTopicsCSV();
}