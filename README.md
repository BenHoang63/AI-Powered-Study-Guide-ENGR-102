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
- **Zero-Waste Hover & Touch Prefetching** — Questions prefetch on mouse hover (`onMouseEnter`) and mobile touch (`onTouchStart`) over the "Start" buttons, absorbing the 300–400 ms human click delay without wasting credits while selecting checkboxes.
- **Single-Round-Trip Architecture** — Eliminates preliminary topic-count network hops by returning chapter metadata and vector-retrieved questions in a single unified API request.
- **Conceptual Topic Smart Routing (`is_concept`)** — PostgreSQL flags purely conceptual topics (e.g., Tree Terminology, Error Classification, Variable Naming Rules). When `code_writing` is requested, the system automatically routes to real coding topics in that chapter (e.g., dictionary manipulation in Chapter 8) to prevent hallucinated data structure / tree traversal problems.
- **Strict Prerequisite Scoping & Invariant Filters** — Enforces course syllabus boundaries forbidding advanced syntax before taught (e.g., no lists/matrices before Ch 7, no dictionaries before Ch 8, no `def` before Ch 9). Automated validation filters reject multi-line loop short answers and inverted logic hallucinations.
- **User Progress Dashboard** — Track topic stats, overall accuracy, attempt counts, and earn "Strong Topic" badges (awarded for $\ge 80\%$ accuracy across $\ge 10$ attempts).
- **Exam 1 & Exam 2 Practice** — Scoped code-writing prep for midterm and final exams with embedded reference formula sheets.
- **Module Notes** — Reference guides for all 12 course modules with links directly to topic review notes.

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
| **AI / LLM** | OpenRouter API (DeepSeek V4 Flash / OpenAI GPT-5.6 Luna) |
| **Embeddings** | Custom embedding pipeline (`backend/llm/embed.js`, `openai/text-embedding-3-small`) |
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
| `POST` | `/api/engr102/quiz/question` | Generate a quiz question via RAG + LLM (supports `isFirstQuestion` routing) |
| `POST` | `/api/engr102/quiz/check_answer` | AI-grade code writing or short answer response |
| `GET` | `/api/engr102/:chapter/num_topics` | Get topic count for a chapter (cached in memory) |
| `POST` | `/api/stats/record` | Record question attempt and accuracy to `user_topic_progress` |
| `GET` | `/api/stats/:course/:email` | Fetch progress dashboard analytics joined with `<course>topics` |
| `POST` | `/api/feedback` | Submit user feedback (rate-limited: 3 per 10 min) |

---

## How the RAG Pipeline Works

1. **Embedding & Storage**: Course curriculum topics and prerequisite boundaries are pre-embedded into 1536-dimensional vectors and stored in PostgreSQL using `pgvector`.
2. **Semantic Retrieval**: When a question is generated, the query context is converted to vector space via `embedQuery()`, and a cosine distance query (`1 - (embedding <=> query_vector)`) retrieves the exact topic context from `engr102topics`.
3. **Smart Concept Routing**: Topics marked with `is_concept = TRUE` (e.g. Tree Terminology) are automatically routed away from `code_writing` to practical coding topics in the same chapter or gracefully defaulted to `multiple_choice`.
4. **Prompt Augmentation**: Retrieved context, reference questions, and chapter boundary constraints are injected into the system instructions.
5. **Constrained Generation**: The LLM outputs a strictly formatted JSON question matching the question type schema without referencing future course concepts.

---

## Performance & Cost Optimization

1. **Hybrid Model Routing**: Uses **OpenAI GPT-5.6 Luna** for the first question to deliver instant start times (~350 ms), and **DeepSeek V4 Flash (`:nitro`)** for ongoing questions to maintain near-zero credit usage (~$0.00015/question).
2. **Zero-Waste Hover Prefetching**: Prefetches the first question during mouse hover (`onMouseEnter`) or mobile touch (`onTouchStart`), absorbing the physical click delay so the quiz starts in 0 ms.
3. **Double-Hop Elimination**: Combines topic metadata discovery and question generation into one unified request, saving ~150 ms of client-to-server latency.
4. **Prerequisite & Invariant Filtering**: Programmatic backend filters discard hallucinated multi-line loop short answers, premature matrix references, and contradictory logic before responses reach the user.
5. **In-Memory Caching**: Pre-warms static curriculum topics and LLM prompt templates into server memory on boot, eliminating 500–1,500 ms remote database queries.

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
OPENROUTER_QUESTION_MODEL=deepseek/deepseek-v4-flash-0731:nitro
OPENROUTER_FIRST_QUESTION_MODEL=openai/gpt-5.6-luna
OPENROUTER_CHECK_MODEL=deepseek/deepseek-v4-flash-0731:nitro
OPENROUTER_REASONING_EFFORT=minimal
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
