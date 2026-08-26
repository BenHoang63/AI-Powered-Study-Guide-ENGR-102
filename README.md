# AI-Powered Study Guide — ENGR 102

An AI-powered, RAG-based study tool built for Texas A&M ENGR 102 students. Generates dynamic quiz questions on demand using a large language model, grounded in course-specific content retrieved from a PostgreSQL vector database (`pgvector`).

> **Access is restricted to `@tamu.edu` email addresses.**

### Accessing the App
- **Live App (TAMU Google Sign-In):** [engr-study-helper.onrender.com](https://engr-study-helper.onrender.com/)
- **Recruiter / Guest Demo Mode:** [engr-study-helper.onrender.com/?demo=demol15ca2026](https://engr-study-helper.onrender.com/?demo=demol15ca2026)

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
- **Exam 1 & Exam 2 Practice** — Scoped code-writing prep for midterm and final exams.
- **Module Notes** — Reference guides for all 12 course modules with links directly to topic review notes.
- **Strict Knowledge Scoping** — Questions never reference concepts from future chapters.

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
| **AI / LLM** | OpenRouter API (Deepseek v4 flash / GPT-4o mini) |
| **Embeddings** | Custom embedding pipeline (`backend/llm/embed.js`) |
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
| `GET` | `/api/engr102/:chapter/num_topics` | Get topic count for a chapter |
| `POST` | `/api/stats/record` | Record question attempt and accuracy to `user_topic_progress` |
| `GET` | `/api/stats/:course/:email` | Fetch progress dashboard analytics joined with `<course>topics` |
| `POST` | `/api/feedback` | Submit user feedback (rate-limited: 3 per 10 min) |

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
OPENROUTER_QUESTION_MODEL=your_preferred_llm
OPENROUTER_CHECK_MODEL=your_preferred_llm
```

Create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_DEMO_TOKEN=your_demo_token
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

## How the RAG Pipeline Works

1. Course topics are pre-embedded and stored in PostgreSQL using `pgvector`.
2. When a question is requested, the chapter/topic context is embedded using the same vector model.
3. Cosine similarity search (`1 - (embedding <=> query_vector)`) retrieves the exact topic context from `engr102topics`.
4. The topic's `context`, `question` sample, and constraints are injected into the LLM prompt.
5. The LLM generates a unique, structured question scoped strictly to that topic and prior chapters.

---

> **Disclaimer:** This project is an independent personal study tool created to help students review course material. It is not officially affiliated with, endorsed by, or sponsored by Texas A&M University.
