# AI-Powered Study Guide — ENGR 102

An AI-powered, RAG-based study tool built for Texas A&M ENGR 102 students. Generates dynamic quiz questions on demand using a large language model, grounded in course-specific content retrieved from a PostgreSQL vector database (`pgvector`).

> **Access is restricted to `@tamu.edu` email addresses.**

### Accessing the App
- **Live App (TAMU Google Sign-In):** [ai-powered-study-guide-engr-102.onrender.com](https://ai-powered-study-guide-engr-102.onrender.com)
- **Recruiter / Guest Demo Mode:** [ai-powered-study-guide-engr-102.onrender.com/?demo=demol15ca2026](https://ai-powered-study-guide-engr-102.onrender.com/?demo=demol15ca2026)

---

## Features

### ENGR 102
- **Topic Quizzer** — Select any chapter and topic; the app uses RAG (Retrieval-Augmented Generation) to pull relevant course content and generates a fresh question every time.
- **Customizable Question Filters** — Toggle between question types:
  - Multiple Choice
  - Multiple Answer
  - Short Answer
  - Code Writing (with live Wasm execution, line numbers, tab support, and AI feedback)
- **In-Browser Python Execution Engine (Pyodide)** — Run user-written Python code directly inside browser Web Workers with interactive `stdin` / `input()` support, 5-second timeout protection against infinite loops, and formatted stdout/stderr output.
- **User Progress Dashboard** — Track topic stats, overall accuracy, attempt counts, and earn "Strong Topic" badges (awarded for $\ge 80\%$ accuracy across $\ge 10$ attempts).
- **Background Prefetching & State Persistence** — Questions pre-fetch seamlessly in the background via global React Context (`QuizFetchContext`), preserving typed code and state when navigating away.
- **Anti-Spam & Rate-Limiting Controls** — Frontend in-flight evaluation locks, a 3-second failure cooldown with instant edit bypass, and backend IP-based sliding-window rate limiting.
- **Exam 1 & Exam 2 Practice** — Scoped code-writing prep for midterm and final exams with embedded reference formula sheets.
- **Module Notes** — Reference guides for all 12 course modules with links directly to topic review notes.
- **Strict Knowledge Scoping** — Questions dynamically scope to the student's current chapter, preventing syntax or concepts from future topics (e.g., forbidding `def` before Chapter 9).

### General
- **Google OAuth & TAMU Restriction** — Sign in with your TAMU Google account.
- **Recruiter / Demo Mode** — Pass key authorization allowing guest evaluation without a TAMU email.
- **User Feedback System** — Submit bug reports and suggestions directly to PostgreSQL with built-in IP rate limiting (3 submissions per 10 min).

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 (Vite), React Router v7, Vanilla CSS |
| **Python Engine** | Pyodide (WebAssembly + Web Workers) |
| **Backend** | Node.js, Express |
| **Database** | PostgreSQL (NeonDB) with `pgvector` extension |
| **AI / LLM** | OpenRouter API (DeepSeek / Gemini / GPT-4o-mini) |
| **Embeddings** | Custom embedding pipeline (`backend/llm/embed.js`, `nvidia/nemotron-3-embed-1b`) |
| **Auth** | Better Auth (`@tamu.edu` restricted + Demo Token bypass) |
| **Deployment** | Render |

---

## Project Structure

```
.
├── backend/
│   ├── llm/
│   │   ├── embed.js              # Embedding pipeline for pgvector RAG
│   │   ├── topics.csv            # Source topic data & contexts
│   │   └── *.txt                 # LLM instruction prompts per question type
│   └── server.js                 # Express API server (RAG, auth, stats, feedback)
└── frontend/
    ├── public/
    │   └── pyodide.worker.js     # Web worker running Pyodide Wasm Python runner
    └── src/
        ├── components/           # Shared components (Navbar, ExamQuizzer, etc.)
        ├── context/
        │   └── QuizFetchContext.jsx  # Global prefetching & background fetch queue
        ├── pages/
        │   ├── engr102/          # ENGR 102 module and quiz pages
        │   ├── HomePage.jsx      # Home dashboard & course selector
        │   ├── LoginPage.jsx     # Google OAuth & Demo sign-in
        │   ├── UserProfile.jsx   # User progress analytics & topic mastery stats
        │   └── Feedback.jsx      # User feedback submission page
        ├── scripts/              # Auth client, demo mode, and helpers
        └── styles/               # Styling files
```

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/engr102/quiz/question` | Generate a quiz question via RAG + LLM |
| `POST` | `/api/engr102/quiz/check_answer` | AI-grade code writing or short answer response |
| `GET` | `/api/engr102/:chapter/num_topics` | Get topic count for a chapter (cached in memory) |
| `POST` | `/api/stats/record` | Record question attempt and accuracy to `user_topic_progress` |
| `GET` | `/api/stats/:course/:email` | Fetch progress dashboard analytics joined with `<course>topics` |
| `POST` | `/api/feedback` | Submit user feedback (rate-limited: 3 per 10 min) |

---

## How the RAG Pipeline Works

1. **Embedding & Storage**: Course curriculum topics and prerequisite boundaries are pre-embedded and indexed in PostgreSQL using `pgvector`.
2. **Semantic Retrieval**: When a student requests a question, the query string is converted to vector space via the embedding model, and a cosine distance query (`1 - (embedding <=> query_vector)`) retrieves the exact topic context from `engr102topics`.
3. **Prompt Augmentation**: Retrieved context, reference sample questions, and dynamic chapter boundary constraints are injected into the LLM prompt.
4. **Constrained Generation**: The LLM outputs a strictly formatted JSON question matching the question type schema without referencing future course concepts.

---

## Performance & Latency Benchmarks

To optimize response times and lower API costs, several system-level optimizations were implemented:
1. **Reasoning Token Suppression**: Configured `reasoning: { effort: "none" }` and `response_format: { type: "json_object" }` to eliminate ~2,500 hidden thinking tokens per request.
2. **In-Memory Caching**: Pre-warmed static curriculum topics and LLM instructions into server memory on startup, eliminating 500–1,500 ms remote database network hops.
3. **Reference Question Pruning**: Replaced monolithic 5,000-character sample question dumps with dynamic single-reference sampling for exam mode.
4. **Client-Side Topic Count Caching**: Cached chapter topic counts in React Context to eliminate sequential preflight HTTP round-trips.

### Optimization Results

| Metric / Mode | Before Optimization | After Optimization | Improvement |
| :--- | :--- | :--- | :--- |
| `GET /num_topics` | ~400 – 600 ms | **< 30 ms** | **~15x faster** |
| `POST /quiz/question` (Topic Quizzer) | 11,330 ms | **~820 ms** | **~13.8x faster** |
| `POST /quiz/question` (Exam 1) | 16,325 ms | **~1,200 ms** | **~13.6x faster** |
| `POST /quiz/question` (Exam 2) | 10,616 ms | **~380 – 900 ms** | **~15–25x faster** |
| **Completion Tokens / Question** | 2,400 – 3,500 tokens | **80 – 175 tokens** | **~93% reduction** |
| **Cost per Question** | ~$0.00053 | **~$0.00004** | **~90% cheaper** |

---

## Local Development

### Prerequisites
- Node.js 18+
- A PostgreSQL database with `pgvector` enabled and `engr102topics`, `user_topic_progress`, and `feedback` tables
- An [OpenRouter](https://openrouter.ai) API key

### Environment Variables

Create `backend/.env`:

```env
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_QUESTION_MODEL=deepseek/deepseek-v4-flash-0731
OPENROUTER_CHECK_MODEL=openai/gpt-4o-mini
```

Create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_DEMO_TOKEN=demol15ca2026
```

### Run

```bash
# Backend (Terminal 1)
cd backend
node server.js

# Frontend (Terminal 2)
cd frontend
npm run dev
```

---

> **Disclaimer:** This project is an independent personal study tool created to help students review course material. It is not officially affiliated with, endorsed by, or sponsored by Texas A&M University.
