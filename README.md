# AI-Powered Study Guide — ENGR 102

An AI-powered, RAG-based study tool built for Texas A&M ENGR 102 students. Generates dynamic quiz questions on demand using a large language model, grounded in course-specific content retrieved from a vector database.

> **Access is restricted to `@tamu.edu` email addresses.**

### Accessing the App
The deployed app (for tamu.edu emails only) can be found at https://ai-powered-study-guide-engr-102.onrender.com
To demo the app with no tamu.edu email, visit https://ai-powered-study-guide-engr-102.onrender.com/?demo=demol15ca2026

---

## Features

### ENGR 102
- **Topic Quizzer** — Select any chapter and topic; the app uses RAG (Retrieval-Augmented Generation) to pull the most relevant course content and generates a fresh question every time
- **4 Question Types**
  - Multiple Choice
  - Multiple Answer
  - Short Answer
  - Code Writing (with line numbers, tab support, and AI-graded evaluation)
- **Exam 1 Practice** — Code writing questions scoped to Chapters 1–7
- **Exam 2 Practice** — Code writing questions across all chapters
- **Module Notes** — Reference pages for all 12 modules
- **Knowledge scoping** — Questions never reference concepts from future chapters

### General
- **Google OAuth** — Sign in with your TAMU Google account
- **Feedback page** — Submit bug reports and suggestions directly to the database

### Coming Soon
- **ETAM** — Study guide support for ETAM courses

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Vanilla CSS |
| Backend | Node.js, Express |
| Database | PostgreSQL (via `pg`) |
| AI / LLM | OpenRouter API |
| Embeddings | Custom embedding pipeline (`backend/llm/embed.js`) |
| Auth | Better Auth (`@tamu.edu` restricted) |
| Deployment | Render |

---

## Project Structure

```
.
├── backend/
│   ├── llm/
│   │   ├── embed.js              # Embedding pipeline for RAG
│   │   ├── topics.csv            # Source topic data
│   │   └── *.txt                 # LLM instruction prompts per question type
│   └── server.js                 # Express API server
└── frontend/
    └── src/
        ├── components/           # Shared UI components (Navbar, QuizCard, etc.)
        ├── pages/
        │   ├── engr102/          # ENGR 102 module and quiz pages
        │   ├── etam/             # ETAM pages (coming soon)
        │   ├── HomePage.jsx
        │   ├── LoginPage.jsx
        │   └── Feedback.jsx
        ├── scripts/              # Auth client and helpers
        └── styles/               # CSS files
```

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/engr102/quiz/question` | Generate a quiz question via RAG + LLM |
| `POST` | `/api/engr102/quiz/check_answer` | AI-grade a code writing answer |
| `GET` | `/api/engr102/:chapter/num_topics` | Get topic count for a chapter |
| `POST` | `/api/feedback` | Submit user feedback (rate-limited: 3 per 10 min) |

---

## Local Development

### Prerequisites
- Node.js 18+
- A PostgreSQL database with the `engr102topics`, `llm_instructions`, and `feedback` tables
- An [OpenRouter](https://openrouter.ai) API key

### Environment Variables

Create `backend/.env`:

```env
DB_HOST=
DB_NAME=
DB_USER=
DB_PASSWORD=
OPENROUTER_API_KEY=
OPENROUTER_QUESTION_MODEL=
OPENROUTER_CHECK_MODEL=
```

Create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

### Run

```bash
# Backend
cd backend
node server.js

# Frontend (separate terminal)
cd frontend
npm run dev
```

---

## How the RAG Pipeline Works

1. Course topics are pre-embedded and stored in PostgreSQL with the `pgvector` extension
2. When a quiz is requested, the chapter/topic hint is embedded using the same model
3. A cosine similarity search retrieves the most relevant topic row
4. The topic's `context`, `question` sample, and `other_instruction` are injected into the LLM prompt
5. The LLM generates a new, unique question scoped strictly to that topic and all prior chapters

