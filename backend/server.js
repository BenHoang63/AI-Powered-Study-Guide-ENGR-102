import dotenv from "dotenv";
dotenv.config();

const QUESTION_MODEL   = process.env.OPENROUTER_QUESTION_MODEL || "deepseek/deepseek-v4-flash-0731";
const CHECK_MODEL      = process.env.OPENROUTER_CHECK_MODEL    || "deepseek/deepseek-v4-flash-0731";
const REASONING_EFFORT = process.env.OPENROUTER_REASONING_EFFORT || "low";
console.log(`[Models] Question: ${QUESTION_MODEL} | Check: ${CHECK_MODEL} | Reasoning: ${REASONING_EFFORT}`);

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

// ── In-Memory Metadata Caches ──
let topicsCache = null;         // Map: chapter (number) -> Array of topic objects
let instructionsCache = null;   // Map: type (string) -> string (instructions)

async function getCachedTopics() {
	if (topicsCache) return topicsCache;
	try {
		const result = await pool.query(
			"SELECT chapter, topic, topic_name, context, question, other_instruction FROM engr102topics ORDER BY chapter, topic"
		);
		const map = new Map();
		for (const row of result.rows) {
			const ch = Number(row.chapter);
			if (!map.has(ch)) map.set(ch, []);
			map.get(ch).push(row);
		}
		topicsCache = map;
		console.log(`[Cache] Loaded ${result.rows.length} topics across ${map.size} chapters into memory.`);
		return topicsCache;
	} catch (err) {
		console.error("[Cache] Failed to load topics cache:", err);
		return null;
	}
}

async function getCachedInstructions(type) {
	if (instructionsCache && instructionsCache.has(type)) {
		return instructionsCache.get(type);
	}
	try {
		const result = await pool.query("SELECT type, instructions FROM llm_instructions");
		instructionsCache = new Map();
		for (const row of result.rows) {
			instructionsCache.set(row.type, row.instructions);
		}
		console.log(`[Cache] Loaded ${instructionsCache.size} instruction types into memory.`);
		return instructionsCache.get(type) || null;
	} catch (err) {
		console.error("[Cache] Failed to load instructions cache:", err);
		return null;
	}
}

// Warm up caches on startup
getCachedTopics();
getCachedInstructions("code_writing");
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

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
	const chNum = Number(chapter);

	// ── Fast in-memory topic retrieval (0ms DB latency) ──
	let topic_name = "";
	let context = "";
	let sample = "";
	let other_instruction = "";
	let topic_number = Number(topic) || 1;

	try {
		const topicsMap = await getCachedTopics();

		if (chNum >= 13) {
			// Exam mode: direct lookup without embedding call
			const targetChapters = chNum === 14 ? [13, 14] : [13];
			let rows = [];
			if (topicsMap) {
				for (const targetCh of targetChapters) {
					if (topicsMap.has(targetCh)) {
						rows.push(...topicsMap.get(targetCh));
					}
				}
			}
			if (rows.length === 0) {
				const result = await pool.query(
					`SELECT chapter, topic_name, context, question, other_instruction
					 FROM engr102topics
					 WHERE chapter = ANY($1::int[])`,
					[targetChapters]
				);
				rows = result.rows;
			}
			if (rows.length === 0) {
				return res.status(404).json({ error: "Exam topic context not found" });
			}
			topic_name = chNum === 14 ? "Exam 2 Review (Cumulative)" : "Exam 1 Review";
			context = rows.map(r => r.context).filter(Boolean).join("\n\n");

			// Extract individual sample questions and pick 1 random reference to keep prompts fast and token-efficient
			const rawSampleQuestions = [];
			for (const r of rows) {
				if (!r.question) continue;
				const parts = r.question.split(/\n(?=\d+\.\s)/).map(s => s.trim()).filter(Boolean);
				rawSampleQuestions.push(...parts);
			}
			sample = rawSampleQuestions.length > 0
				? rawSampleQuestions[Math.floor(Math.random() * rawSampleQuestions.length)]
				: "";

			other_instruction = rows.map(r => r.other_instruction).filter(Boolean).join(" ");
		} else {
			// ── Vector RAG Retrieval via pgvector ──
			const chTopics = topicsMap?.get(chNum) || [];
			const requestedTopic = chTopics.find(t => Number(t.topic) === topic_number) 
				|| chTopics[0];

			let question_topic = null;

			try {
				const queryText = requestedTopic
					? `Topic ${topic_number}: ${requestedTopic.topic_name}. ${requestedTopic.context.slice(0, 100)}`
					: `Chapter ${chapter}: ${TOPIC_MAP[String(chapter)] || ""}`;

				const queryVector = await embedQuery(queryText);
				const vectorString = JSON.stringify(queryVector);

				// Filter by requested topic if specified so all topics (2.1, 2.2, 2.3...) get traversed,
				// while maintaining pgvector cosine distance calculation
				const result = await pool.query(
					`SELECT topic, topic_name, context, question, other_instruction,
					        1 - (embedding <=> $1::vector) AS similarity
					 FROM engr102topics
					 WHERE chapter = $2 ${topic ? "AND topic = $3" : ""}
					 ORDER BY embedding <=> $1::vector
					 LIMIT 1`,
					topic ? [vectorString, chNum, topic_number] : [vectorString, chNum]
				);

				if (result.rows.length > 0) {
					question_topic = result.rows[0];
				}
			} catch (ragErr) {
				console.warn("[RAG] Vector retrieval fallback to cached topic:", ragErr.message);
			}

			// Graceful fallback to cached topic if embedding API is rate-limited or fails
			if (!question_topic) {
				question_topic = requestedTopic;
			}

			if (!question_topic) {
				return res.status(404).json({ error: "Topic not found" });
			}

			topic_number = question_topic.topic || topic_number;
			topic_name = question_topic.topic_name;
			context = question_topic.context;
			sample = question_topic.question;
			other_instruction = question_topic.other_instruction;
		}
	} catch (err) {
		console.error("Error during topic retrieval:", err);
		return res.status(500).json({ error: "Internal server error during topic retrieval" });
	}

	// create question prompt (cached in memory)
	let questionPrompt = await getCachedInstructions(type);
	if (!questionPrompt) {
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
	}


	// future topic restriction constraint
	const effectiveChapter = Number(chapter) === 13 ? 7 : Number(chapter) === 14 ? 12 : Number(chapter);

	const futureTopics = Object.keys(TOPIC_MAP)
		.filter(chapNum => Number(chapNum) > effectiveChapter)
		.map(chapNum => TOPIC_MAP[chapNum]);

	let restrictionNotice = "";
	if (futureTopics.length > 0) {
		const bannedNames = futureTopics.map(t => t.split(" (")[0]).join(", ");
		restrictionNotice += `\n5. PREREQUISITES: The student has ONLY learned up to Chapter ${effectiveChapter} (${topic_name}). Do NOT use syntax or concepts from later topics (${bannedNames}). All code must stay strictly within Chapter ${effectiveChapter}.`;
	}
	if (effectiveChapter < 7) {
		restrictionNotice += `\n   - NO LISTS OR MATRICES: Lists, nested lists, 2D grids, matrices, and list indexing are NOT taught until Chapter 7. All loops must iterate over numbers using range() or characters in strings, NEVER lists or matrices!`;
	}
	if (effectiveChapter < 8) {
		restrictionNotice += `\n   - NO DICTIONARIES: Dictionaries and sets are NOT taught until Chapter 8.`;
	}
	if (effectiveChapter < 9) {
		restrictionNotice += `\n   - NO USER-DEFINED FUNCTIONS: Functions ('def', parameters, 'return') are not taught until Chapter 9—use only standalone script code.`;
	}
	if (effectiveChapter < 10) {
		restrictionNotice += `\n   - NO EXCEPTION HANDLING: 'try'/'except' blocks are not taught until Chapter 10.`;
	}
	if (effectiveChapter < 11) {
		restrictionNotice += `\n   - NO FILE I/O: File reading/writing ('open()', CSVs) is not taught until Chapter 11.`;
	}

	let examNotice = "";
	if (Number(chapter) >= 13) {
		examNotice = `\n6. EXAM GUIDELINES: Create a practical engineering or real-world problem (sensor data, calculations). Clearly state input requirements, formulas, and expected outputs. Do NOT copy sample question scenarios or variable names. Keep scope answerable in 1-2 minutes.`;
	}

	const systemPrompt = `You are a quiz question generator for an introductory college Python course. Generate exactly ONE question at a time.
Respond with ONLY a valid raw JSON object matching the requested schema. Do not wrap the JSON response in top-level code fences.

CORE RULES:
1. FORMATTING: Wrap all inline code/variables/operators/mathematical expressions in single \`backticks\` (e.g. \`x\`, \`print()\`, \`==\`, \`(3 + 7) * 2 - 5 ** 2 / 5\`). Wrap multi-line code in triple-backtick \`\`\`python blocks. Use actual \\n in JSON strings for newlines. For bold emphasis on key terms, use double asterisks: **term**. Never leave mathematical expressions with exponents unwrapped.
2. VERIFY ARITHMETIC & PYTHON TYPES FIRST: In "step_by_step_solution", trace code line-by-line and compute exact results FIRST before setting options or answers. Double-check all arithmetic and operations (e.g. 5 + 2 = 7, not 12; 10 // 3 = 3; "ab" * 2 = "abab").
   - PYTHON TYPE INTEGRITY: Division (/) and operations with floats or fractional powers (e.g. 1/2 = 0.5, so 16 ** (1/2) or 16 ** 0.5) ALWAYS produce a float. Printed output for floats MUST include the decimal point (e.g. 4.0, NOT 4; 16 / 4 is 4.0, NOT 4; 2 ** -1 is 0.5). Floor division (//) between ints produces an int (e.g. 16 // 4 is 4). Never omit or strip the decimal .0 from float outputs.
3. SINGLE-ANSWER INVARIANT: For multiple_choice, exactly ONE option must be correct; all 3 distractors MUST be unambiguously false or invalid.
   - For comparisons/relational operators: Prefer asking for the evaluation (e.g. "Which of the following expressions evaluates to \`True\`?" or "What is the boolean output of \`...\`?") so that exactly 1 option is True and the others are False or SyntaxErrors.
   - DO NOT ask vague questions like "Which statement is a valid comparison?" because multiple comparisons (like \`5 == 5\` and \`15 > 10\`) are syntactically valid.
   - NEVER generate a multiple_choice question where multiple options are valid or plausible.
   - NEVER rationalize an answer by claiming an option is "most appropriate", "evaluated to True", "better", or "the first valid option" while other options are also valid.
   - If asking to identify a valid syntax or operator, exactly THREE options must contain clear syntax errors or invalid operations, and only ONE option can be valid.
4. AVOID NEGATIVE PHRASING: Ask direct, positive questions (e.g. prefer "Which statement raises a ValueError?" over "Which statement will NOT raise an error?").
5. SHORT ANSWER INTEGRITY: Answers MUST be a single, deterministic value (exact code output, True/False, Yes/No, keyword, or number).
   - NEVER ask open-ended questions like "What is a valid...?", "Name a...", or "Give an example of..." because student answers are graded with exact string matching. For rules or concepts (like variable names or syntax), ask True/False, Yes/No, or whether a specific name/statement is valid (e.g. "True or False: Can a variable name start with a digit?").
   - LOOPS IN SHORT ANSWER: NEVER ask "What is the output of the code?" for a loop that prints multiple lines (e.g. \`for i in range(5): print(i)\`), because multi-line outputs cannot be unambiguously typed into a single text box. Instead, ask:
     * "What is the final value printed by the loop?" (e.g. \`4\`)
     * "What is the first value printed by the loop?" (e.g. \`0\`)
     * "How many times does the loop execute?" (e.g. \`5\`)
     * "What is the value of variable X after the loop?" (accumulator pattern)
   - "correct_answers" MUST contain synonyms of the SAME single value (e.g. ["4.0", "4"], ["True", "true"]). NEVER populate "correct_answers" with distinct values from different loop iterations (like ["0", "1", "2", "3", "4"]).
6. MULTIPLE ANSWER INTEGRITY:
   - For "Which of the following are True?" questions, ONLY mark an option as correct if the statement itself is factually and syntactically TRUE in Python.
   - If an option describes an action that is illegal or causes an error (e.g. "break can be used outside a loop"), that statement is FALSE! NEVER mark an illegal or error-causing action as a "true statement" (e.g. NEVER say "Option D is correct because using break outside a loop raises a SyntaxError").
   - In "step_by_step_solution", evaluate each option (A, B, C, D) individually as True or False FIRST before setting "correct_answers".
   - Avoid compound ambiguous requirements like "validate for math.sqrt() and math.log()". State "for BOTH function X and function Y", or focus on a single function.${restrictionNotice}${examNotice}

${questionPrompt}
`;

	let effectiveOtherInstruction = other_instruction || "";
	if (type !== "multiple_answer") {
		// Strip any "Select all" instructions when generating single-choice, short-answer, or code questions
		effectiveOtherInstruction = effectiveOtherInstruction
			.replace(/\b(select|choose)\s+all\b[^.]*\.?/gi, "")
			.trim();
	}

	const userPrompt = `Generate a ${type} question about topic ${topic_name}: ${context}.

Sample reference questions (DO NOT REUSE ANY PARTS OF THESE):
${sample}

Other instructions: ${effectiveOtherInstruction || "N/A"}
`;

	for (let i = 0; i < 3; i++) {
		const currentModel = i === 0 ? QUESTION_MODEL : (process.env.OPENROUTER_CHECK_MODEL || "deepseek/deepseek-v4-flash-0731");
		try {
			const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
					"Content-Type": "application/json",
					"HTTP-Referer": "https://engr-study-helper.onrender.com",
					"X-Title": "ENGR 102 Study Guide"
				},
				body: JSON.stringify({
					model: currentModel,
					messages: [
						{ role: "system", content: systemPrompt },
						{ role: "user",   content: userPrompt }
					],
					temperature: 0.7,
					response_format: { type: "json_object" },
					reasoning: { effort: REASONING_EFFORT, exclude: true },
					max_tokens: 1500
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

			// ── Post-processing: Resolve option letter mismatches & enforce consistency ──
			if (question.type === "multiple_choice" && question.options && typeof question.options === "object") {
				const optEntries = Object.entries(question.options);

				// 1. If correct_answer was given as the literal value instead of a letter (e.g. "5" instead of "A"), map it
				const directMatch = optEntries.find(([k, v]) => String(v).trim().toLowerCase() === String(question.correct_answer).trim().toLowerCase());
				if (directMatch && !question.options[question.correct_answer]) {
					question.correct_answer = directMatch[0];
				}

				// 2. If explanation explicitly states the correct value (e.g. "correct answer is 3.0" or "results in 4.0") but correct_answer points to another option, auto-correct it
				if (question.explanation) {
					const currentSelectedVal = String(question.options[question.correct_answer] || "").trim();
					const match = question.explanation.match(/(?:correct answer is|answer is|results in|output is)\s*`?([a-zA-Z0-9_.-]+)`?/i);
					if (match) {
						const explainedVal = match[1].trim().replace(/\.$/, "");
						if (explainedVal !== currentSelectedVal) {
							const betterMatch = optEntries.find(([k, v]) => String(v).trim().toLowerCase() === explainedVal.toLowerCase());
							if (betterMatch) {
								console.log(`[Auto-Correct] Reconciled option letter from "${question.correct_answer}" (${currentSelectedVal}) to "${betterMatch[0]}" (${betterMatch[1]}) based on explanation.`);
								question.correct_answer = betterMatch[0];
							}
						}
					}

					// Contradiction check: if explanation literally says the currently selected option is incorrect, discard and retry
					const contradictionRegex = new RegExp(`Option\\s+${question.correct_answer}\\b[^.]*\\bis incorrect\\b`, "i");
					if (contradictionRegex.test(question.explanation)) {
						console.warn(`[Validation] Explanation states selected option "${question.correct_answer}" is incorrect! Discarding contradictory question.`);
						continue;
					}
				}

				// 3. Multi-answer detection: if explanation or solution admits multiple options are correct, reject and retry
				const multipleValidRegex = /\b(options?\s+[A-D](?:\s*,\s*[A-D])*\s*(?:and|&|,)\s*[A-D]|both\s+[A-D]\s+and\s+[A-D]|all\s+of\s+the\s+above|first valid|not the only|is also valid|is also correct|also valid|also a valid|more than one|multiple correct|multiple valid|conflicts with the requirement|most appropriate|first correct|neither.*nor.*both|also a correct|valid but not the only)\b/i;
				const solutionStr = typeof question.step_by_step_solution === "string" 
					? question.step_by_step_solution 
					: JSON.stringify(question.step_by_step_solution || "");
				if (multipleValidRegex.test(question.explanation || "") || multipleValidRegex.test(solutionStr)) {
					console.warn(`[Validation] Discarding multiple_choice question with multiple valid options: "${question.question?.slice(0, 60)}..."`);
					continue;
				}
			}

			if (question.type === "short_answer") {
				const openEndedRegex = /\b(what is a valid|give an example|name a valid|write a valid|provide an example|give a valid|name an example)\b/i;
				if (openEndedRegex.test(question.question || "")) {
					console.warn(`[Validation] Discarding open-ended short_answer question: "${question.question}"`);
					continue;
				}

				// Reject loop questions asking for multi-line output without asking for a single qualifier
				const qText = question.question || "";
				const multiLineLoopOutputRegex = /\bwhat is the (?:exact )?output\b/i;
				const loopSnippetRegex = /\b(for|while)\b[\s\S]*?\bprint\s*\(/i;
				const hasQualifierRegex = /\b(final|last|first|sum|total|how many)\b/i;
				if (multiLineLoopOutputRegex.test(qText) && loopSnippetRegex.test(qText) && !hasQualifierRegex.test(qText)) {
					console.warn(`[Validation] Discarding short_answer question asking for multi-line loop output: "${qText.slice(0, 60)}..."`);
					continue;
				}

				// Reject if correct_answers contains distinct non-equal numbers (different loop outputs instead of synonyms)
				const answers = Array.isArray(question.correct_answers) ? question.correct_answers : [];
				const numericVals = answers.map(a => Number(String(a).trim())).filter(n => !isNaN(n));
				if (numericVals.length >= 2) {
					const distinctInts = new Set(numericVals.map(n => Math.round(n)));
					if (distinctInts.size > 1) {
						console.warn(`[Validation] Discarding short_answer question with non-synonym answer list: ${JSON.stringify(answers)}`);
						continue;
					}
				}
			}

			if (question.type === "multiple_answer") {
				const qText = question.question || "";
				const correctList = Array.isArray(question.correct_answers) ? question.correct_answers : [];
				const expl = question.explanation || "";
				const isErrorQuestion = /\b(raise(s)?|error|invalid|syntaxerror|exception|fails?|false)\b/i.test(qText);

				// Contradiction check: if question asks for true/valid statements, but explanation says a selected option causes error / is invalid / is false / is incorrect
				let hasContradiction = false;
				for (const optKey of correctList) {
					const contradictionRegex = new RegExp(`Option\\s+${optKey}\\b[^.]*\\b(is incorrect|is false|is invalid|causes an error|raises a SyntaxError|raises an error|is a SyntaxError)\\b`, "i");
					if (!isErrorQuestion && contradictionRegex.test(expl)) {
						console.warn(`[Validation] Discarding multiple_answer question where marked correct option "${optKey}" is contradicted in explanation: "${expl.slice(0, 120)}..."`);
						hasContradiction = true;
						break;
					}
				}
				if (hasContradiction) {
					continue;
				}
			}

			// ── Prerequisite guard: prevent future topic concepts from leaking into earlier chapters ──
			if (effectiveChapter < 7) {
				const prematureListRegex = /\b(list of lists|2d grid|two-dimensional (?:grid|list|array)|matrix|matrices|nested list|nested lists)\b/i;
				if (prematureListRegex.test(question.question || "")) {
					console.warn(`[Validation] Discarding question using lists/matrices prior to Chapter 7: "${question.question?.slice(0, 70)}..."`);
					continue;
				}
			}
			if (effectiveChapter < 9) {
				const prematureDefRegex = /\b(write a function|define a function|def\s+[a-zA-Z_])/i;
				if (prematureDefRegex.test(question.question || "")) {
					console.warn(`[Validation] Discarding question asking for function definition prior to Chapter 9: "${question.question?.slice(0, 70)}..."`);
					continue;
				}
			}

			return res.json({
				"topic_number": topic_number,
				"topic_name": topic_name,
				"llm_response": question,
			});

		} catch (err) {
			console.error(`Quiz generation error (attempt ${i + 1}/3):`, err);
			continue;
		}
	}

	return res.status(500).json({ error: "Failed to generate valid question from AI after 3 attempts. Please try again." });
});

// Rate limiting and concurrency control for check_answer
const activeCheckAnswerIps = new Set();
const checkAnswerRateLimit = new Map();
const CHECK_ANSWER_WINDOW_MS = 60 * 1000; // 1 minute
const CHECK_ANSWER_MAX_PER_WINDOW = 15; // Generous for humans (15/min), prevents spam

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

	const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || req.socket.remoteAddress;

	// In-flight concurrency lock per client IP
	if (activeCheckAnswerIps.has(clientIp)) {
		return res.status(429).json({ error: "An evaluation is already in progress. Please wait." });
	}

	// Sliding-window rate limit
	const now = Date.now();
	const timestamps = (checkAnswerRateLimit.get(clientIp) || []).filter(
		t => now - t < CHECK_ANSWER_WINDOW_MS
	);
	if (timestamps.length >= CHECK_ANSWER_MAX_PER_WINDOW) {
		return res.status(429).json({ error: "Too many evaluation requests. Please slow down." });
	}
	timestamps.push(now);
	checkAnswerRateLimit.set(clientIp, timestamps);

	activeCheckAnswerIps.add(clientIp);
	try {

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
					"HTTP-Referer": "https://engr-study-helper.onrender.com",
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
	} finally {
		activeCheckAnswerIps.delete(clientIp);
	}
});


// ============================ get number of topics per chapter ============================ //
app.get("/api/engr102/:chapter/num_topics", async (req, res) => {
	const chNum = Number(req.params.chapter);
	const topicsMap = await getCachedTopics();
	if (topicsMap && topicsMap.has(chNum)) {
		return res.json({ topicCount: topicsMap.get(chNum).length });
	}
	try {
		const result = await pool.query("SELECT COUNT(*) FROM engr102topics WHERE chapter = $1", [chNum]);
		const topicCount = parseInt(result.rows[0].count, 10);
		return res.json({ topicCount });
	} catch (err) {
		console.error("Error getting number of topics per chapter:", err);
		return res.status(500).json({ error: "Internal server error getting number of topics per chapter" });
	}
});


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

	if (message.length > 1000) {
		return res.status(400).json({ error: "Message exceeds maximum limit of 1000 characters." });
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
// Catch-all route for React Router (must be AFTER all API routes)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
app.listen(3000, () => {
	console.log("Server started at http://localhost:3000");
});