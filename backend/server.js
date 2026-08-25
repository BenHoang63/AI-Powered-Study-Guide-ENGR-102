import dotenv from "dotenv";
dotenv.config();

const QUESTION_MODEL = process.env.OPENROUTER_QUESTION_MODEL || "openrouter/free";
const CHECK_MODEL    = process.env.OPENROUTER_CHECK_MODEL    || "openrouter/free";
console.log(`[Models] Question: ${QUESTION_MODEL} | Check: ${CHECK_MODEL}`);

import express from "express";
import pg from "pg";

import { embedQuery } from "./llm/embed.js";

const app = express();
app.use(express.json());

import fs from 'fs';

// ── CORS — allow frontend dev server ──
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	if (req.method === "OPTIONS") return res.sendStatus(200);
	next();
});

// ── database connection ──
const pool = new pg.Pool({
  host:     process.env.DB_HOST,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port:     5432,
  ssl:      { rejectUnauthorized: false }
});

// Handle unexpected errors on idle pool clients (prevents server crashes on network disconnects)
pool.on('error', (err, client) => {
	console.error('Unexpected error on idle database client:', err);
});

// test the connection on startup
pool.connect((err, client, release) => {
	if (err) {
		console.error('Failed to connect to database:', err);
	} else {
		console.log('Connected to PostgreSQL database');
		release();
	}
});

app.get("/", (request, response) => {
	response.send("Server is ready");
});

// ==================== topic mapping ====================
const TOPIC_MAP = {
	1:  "Intro to Computing & Python (print statements, basic math, the math module, data types: int, float, bool, str)",
	2:  "Variables & Expressions (variable assignment, naming rules, expressions, type casting)",
	3:  "Types & Strings (string methods, string indexing/slicing, string formatting, type conversion)",
	4:  "Boolean Expressions & Conditionals (comparison operators, logical operators, if/elif/else statements)",
	5:  "Program Design & Testing (algorithm design, pseudocode, testing strategies, debugging)",
	6:  "Loops (for loops, while loops, range(), nested loops, break/continue)",
	7:  "Lists (list creation, indexing, slicing, list methods, list comprehensions, iterating over lists)",
	8:  "Top-Down Design & Dictionaries (functions for modularity, dictionary creation, keys/values, dictionary methods)",
	9:  "User-Designed Functions & Mutable/Immutable Data Types (def, parameters, return values, scope, mutable vs immutable)",
	10: "Exceptions & Errors (try/except, common exceptions, raising exceptions, error types)",
	11: "Files (opening/closing files, reading/writing files, file modes, CSV files)",
	12: "Modules (importing modules, creating modules, standard library modules, pip)",
};

// ==================== quiz question endpoint ====================

// get question
app.post("/api/engr102/quiz/question", async (req, res) => {
	/*
	input JSON
	{
		"chapter": int,
		"topic": int,
		"type": str
	}

	output JSON: depends on question type (see llm instructions)
	{
		"topic_name": str,
		"llm_response": {}
	}
	*/

	// get body and variables
	const { chapter, topic, type } = req.body;

	// ── RAG: embed the query and retrieve the most relevant topic row ──
	let topic_name = "";
	let context = "";
	let sample = "";
	let other_instruction = "";
	try {
		// Build a human-readable query string from chapter/topic hint
		const chapterDesc = TOPIC_MAP[String(chapter)] || `Chapter ${chapter}`;
		const queryText = `Chapter ${chapter}, topic ${topic}: ${chapterDesc}`;

		// Embed the query with the same model used during indexing
		const queryVector = await embedQuery(queryText);
		const vectorString = JSON.stringify(queryVector);

		// Cosine similarity search — nearest neighbour within the requested chapter
		const result = await pool.query(
			`SELECT topic_name, context, question, other_instruction,
			        1 - (embedding <=> $1::vector) AS similarity
			 FROM engr102topics
			 WHERE chapter = $2
			 ORDER BY embedding <=> $1::vector
			 LIMIT 1`,
			[vectorString, chapter]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Topic not found" });
		}
		const question_topic = result.rows[0];
		console.log(`[RAG] Retrieved: "${question_topic.topic_name}" (similarity: ${Number(question_topic.similarity).toFixed(4)})`);
		topic_name = question_topic.topic_name;
		context = question_topic.context;
		sample = question_topic.question;
		other_instruction = question_topic.other_instruction;
	} catch (err) {
		console.error("Error during RAG topic retrieval:", err);
		return res.status(500).json({ error: "Internal server error during RAG retrieval" });
	}

	// create question prompt
	let questionPrompt = "";
	try {
		const result2 = await pool.query("SELECT instructions FROM llm_instructions WHERE type=$1", [type]);
		if (result2.rows.length === 0) {
			return res.status(404).json({ error: "Instructions not found" });
		}
		questionPrompt = result2.rows[0].instructions;
	} catch (err) {
		console.error("Error getting instructions:", err);
		return res.status(500).json({ error: "Internal server error getting instructions" });
	}


	// future topic restriction constraint
	const futureTopics = Object.keys(TOPIC_MAP)
		.filter(chapNum => Number(chapNum) > Number(chapter))
		.map(chapNum => TOPIC_MAP[chapNum]);

	let restrictionNotice = "";
	if (futureTopics.length > 0) {
		restrictionNotice += `STRICT KNOWLEDGE SCOPE CONSTRAINT:
The student has ONLY learned topics up to Chapter ${chapter} (${topic_name}). 
DO NOT use, require, or reference concepts, syntax, or data structures from future topics:
${futureTopics.map(t => `- ${t}`).join("\n")}
The question and solution code MUST ONLY rely on concepts introduced up to Chapter ${chapter}.`;
	}

	if (Number(chapter) < 9) {
		restrictionNotice += `\n\nCRITICAL FUNCTION CREATION RESTRICTION:
The student HAS NOT learned user-defined functions yet (which is taught in Chapter 9). 
DO NOT ask the student to write, create, or define a function (DO NOT use 'def', function parameters, or 'return'). 
Instead, ask the student to write a standalone Python script or code snippet using standard statements/variables/inputs directly.`;
	}

	const systemPrompt = `You are a quiz question generator for a university-level introductory Python programming course. 
Generate exactly ONE question at a time. Context and a sample question (which should not be used) is provided.
IMPORTANT: Respond with ONLY valid raw JSON object. Do not wrap the JSON response in top-level code fences.

MANDATORY FORMATTING RULES — you MUST follow these exactly:
1. ANY variable name, function call, operator, keyword, or short expression that appears inline within text MUST be wrapped in single backticks. Example: use \`x\`, \`int()\`, \`print("Hello")\`, \`in\`, \`==\` — NEVER write them bare in the text.
2. ANY block of code (2 or more lines, or a complete script/snippet) MUST be placed in a triple-backtick code block on its own line. Example:
   \`\`\`python
   x = 5
   print(x)
   \`\`\`
   Do NOT write multi-line code inline without backticks.
3. When the question or explanation naturally involves a newline (e.g. listing steps, output lines, or code), use actual \\n characters in the JSON string — do NOT write everything as one long run-on sentence.
4. For **bold** emphasis on key terms, use double asterisks: **term**.
5. These rules apply to ALL fields: 'question', 'options', 'explanation', 'correct_answers'.

${questionPrompt}

${restrictionNotice}
`;

	const userPrompt = `Generate a ${type} question about topic ${topic_name}: ${context}.

Sample question for reference (do not reuse): ${sample}
Other instructions: ${other_instruction}
`;

	for (let i = 0; i < 3; i++) {
		try {
			const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
					"Content-Type": "application/json",
					"HTTP-Referer": "https://engr102-study-guide.onrender.com",
					"X-Title": "ENGR 102 Study Guide"
				},
				body: JSON.stringify({
					model: QUESTION_MODEL,
					messages: [
						{ role: "system", content: systemPrompt },
						{ role: "user",   content: userPrompt }
					],
					temperature: 0.8
				})
			});

			if (!response.ok) {
				const errBody = await response.text();
				console.error("OpenRouter error:", response.status, errBody);
				// check if code 429
				if (response.status === 429) {
					console.log('Free rate limit exceeded');
					return res.status(429).json({ error: "Free rate limit exceeded." })
				}
				continue;
			}

			const data = await response.json();
			const rawContent = data.choices?.[0]?.message?.content;

			if (!rawContent) {
				console.error("Empty response from AI");
				continue;
			}

			// Extract JSON substring between the first '{' and last '}'
			const firstBrace = rawContent.indexOf("{");
			const lastBrace = rawContent.lastIndexOf("}");

			if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
				console.error("No valid JSON object found in response:", rawContent);
				continue;
			}

			const jsonString = rawContent.slice(firstBrace, lastBrace + 1);
			const question = JSON.parse(jsonString);

			return res.json({
				"topic_name": topic_name,
				"llm_response": question,
			});

		} catch (err) {
			console.error(`Quiz generation error (attempt ${i + 1}/3):`, err);
			continue;
		}
	}

	return res.status(500).json({ error: "Failed to generate valid question from AI after 3 attempts" });
});

// ============================ check code writing answer ============================ //
app.post("/api/engr102/quiz/check_answer", async (req, res) => {
/*
	input JSON
	{
		"question": str,
		"user_answer": str
	}
	output JSON
	{
		"is_correct": bool,
		"explanation": str
	}
*/
	const { question, user_answer } = req.body;
	if (!question || !user_answer) {
		return res.status(400).json({ error: "Missing question or user_answer" });
	}

	const systemPrompt = `You are an automated code evaluator for an introductory Python programming course. 
Analyze the student's Python answer against the question requirements.
Return a JSON object with:
- "is_correct": true if the answer correctly solves the question, false otherwise.
- "explanation": a concise string explaining why it is correct or what is missing/wrong.

IMPORTANT: Respond with ONLY raw valid JSON matching this schema, no markdown, no code fences:
{
  "is_correct": true,
  "explanation": "Feedback explanation string"
}
`;

	const userPrompt = `Question: ${question}
Student's Answer:
${user_answer}
`;

	for (let i = 0; i < 3; i++) {
		try {
			const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
					"Content-Type": "application/json",
					"HTTP-Referer": "https://engr102-study-guide.onrender.com",
					"X-Title": "ENGR 102 Study Guide"
				},
				body: JSON.stringify({
					model: CHECK_MODEL,
					messages: [
						{ role: "system", content: systemPrompt },
						{ role: "user",   content: userPrompt }
					],
					temperature: 0.2
				})
			});

			if (!response.ok) {
				const errBody = await response.text();
				console.error("OpenRouter error checking answer:", response.status, errBody);
				continue;
			}

			const data = await response.json();
			const rawContent = data.choices?.[0]?.message?.content;

			if (!rawContent) {
				console.error("Empty response from AI checking answer");
				continue;
			}

			// Extract JSON substring between '{' and '}'
			const firstBrace = rawContent.indexOf("{");
			const lastBrace = rawContent.lastIndexOf("}");

			if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
				console.error("No valid JSON object found in response:", rawContent);
				continue;
			}

			const jsonString = rawContent.slice(firstBrace, lastBrace + 1);
			const result = JSON.parse(jsonString);

			return res.json({
				is_correct: Boolean(result.is_correct),
				explanation: result.explanation || result.feedback || ""
			});

		} catch (err) {
			console.error(`Error checking code answer (attempt ${i + 1}/3):`, err);
			continue;
		}
	}

	return res.status(500).json({ error: "Failed to evaluate code answer after 3 attempts" });
});


// ============================ get number of topics per chapter ============================ //
app.get("/api/engr102/:chapter/num_topics", async (req, res) => {
	const chapter = req.params.chapter;
	try {
		const result = await pool.query("SELECT COUNT(*) FROM engr102topics WHERE chapter = $1", [chapter]);
		// console.log(result);
		const topicCount = result.rows[0].count;
		return res.json({ topicCount });
	} catch (err) {
		console.error("Error getting number of topics per chapter:", err);
		return res.status(500).json({ error: "Internal server error getting number of topics per chapter" });
	}
})


// ============================ feedback ============================ //

// In-memory rate limit store: email -> array of submission timestamps
const feedbackRateLimit = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 3;

app.post("/api/feedback", async (req, res) => {
	/*
	input JSON
	{
		"user_email": str,
		"message": str,
		"category": str,  // 'bug' | 'suggestion' | 'general' | 'other'
		"page": str
	}
	*/
	const { user_email, message, category, page } = req.body;

	if (!user_email || !message) {
		return res.status(400).json({ error: "Missing user_email or message." });
	}

	// ── Rate limiting ──
	const now = Date.now();
	const timestamps = (feedbackRateLimit.get(user_email) || []).filter(
		t => now - t < RATE_LIMIT_WINDOW_MS
	);
	if (timestamps.length >= RATE_LIMIT_MAX) {
		return res.status(429).json({
			error: `You've submitted too many times. Please wait a few minutes before trying again.`
		});
	}
	timestamps.push(now);
	feedbackRateLimit.set(user_email, timestamps);

	try {
		await pool.query(
			`INSERT INTO feedback (user_email, message, category, page)
			 VALUES ($1, $2, $3, $4)`,
			[user_email, message, category || "other", page || null]
		);
		return res.json({ success: true });
	} catch (err) {
		console.error("Error inserting feedback:", err);
		return res.status(500).json({ error: "Internal server error saving feedback." });
	}
});


// ============================ user profile ============================ //

// record topic progress
app.post("/api/stats/record", async (req, res) => {
    /*
    input JSON
    {
        "email": str,
        "course": str,    // e.g. "engr102"
        "chapter": int,
        "topic": int,
        "is_correct": bool,
        "attempts": int,  // optional
        "correct": int    // optional
    }
    */
    const { email, course, chapter, topic, is_correct, attempts: reqAttempts, correct: reqCorrect } = req.body;

    if (!email || !course || !chapter || !topic)
        return res.status(400).json({ error: "Missing required fields." });

    const numAttempts = reqAttempts !== undefined ? Number(reqAttempts) : 1;
    const numCorrect  = reqCorrect  !== undefined ? Number(reqCorrect)  : (is_correct ? 1 : 0);

    try {
        await pool.query(
            `INSERT INTO user_topic_progress (email, course, chapter, topic, attempts, correct)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (email, course, chapter, topic) DO UPDATE SET
                 attempts = user_topic_progress.attempts + $5,
                 correct  = user_topic_progress.correct + $6`,
            [email, course, chapter, topic, numAttempts, numCorrect]
        );
        return res.json({ success: true });
    } catch (err) {
        console.error("Error recording topic progress:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
});

// get topic progress
app.get("/api/stats/:course/:email", async (req, res) => {
    const { course, email } = req.params;

    if (!/^[a-zA-Z0-9_]+$/.test(course)) {
        return res.status(400).json({ error: "Invalid course parameter." });
    }

    const topicsTable = `${course.toLowerCase()}topics`;

    try {
        const result = await pool.query(
            `SELECT p.chapter, p.topic, t.topic_name, p.attempts, p.correct,
                    CASE WHEN p.attempts > 0
                         THEN ROUND((p.correct::NUMERIC / p.attempts) * 100, 1)
                         ELSE NULL
                    END AS accuracy_pct
             FROM user_topic_progress p
             LEFT JOIN ${topicsTable} t ON p.chapter = t.chapter AND p.topic = t.topic
             WHERE p.email = $1 AND p.course = $2
             ORDER BY p.chapter, p.topic`,
            [email, course]
        );
        return res.json({ stats: result.rows });
    } catch (err) {
        console.error("Error fetching topic progress:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
});



app.listen(3000, () => {
	console.log("Server started at http://localhost:3000");
});