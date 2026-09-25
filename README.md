# AI-Powered Study Guide — ENGR 102

An AI-powered, RAG-based study tool built for Texas A&M ENGR 102 students. Generates dynamic quiz questions on demand using large language models, grounded in course-specific content retrieved from a PostgreSQL vector database (`pgvector`).

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
  - Code Writing (with live Wasm execution, line numbers, tab support, interactive input, and AI feedback)
- **Answer Locking on Correct Answers** — Once a question is answered correctly in either Topic Quizzer or Exam Review, input fields and answer choices are automatically frozen to prevent accidental modifications and preserve the validated state.
- **In-Browser Python Execution Engine (Pyodide)** — Run user-written Python code directly inside browser Web Workers with interactive `stdin` / `input()` prompt handling, 5-second timeout protection against infinite loops, and formatted stdout/stderr output.
- **Interactive `stdin` Guide (`/other/how-to-use-stdin`)** — Interactive tutorial demonstrating step-by-step how user keyboard input operates within the Pyodide WebAssembly runner.
- **Zero-Waste Hover & Touch Prefetching** — Questions prefetch on mouse hover (`onMouseEnter`) and mobile touch (`onTouchStart`) over the "Start" buttons, absorbing the 300–400 ms human click delay without wasting credits while selecting checkboxes.
- **Single-Round-Trip Architecture** — Eliminates preliminary topic-count network hops by returning chapter metadata and vector-retrieved questions in a single unified API request.
- **Conceptual Topic Smart Routing (`is_concept`)** — PostgreSQL flags purely conceptual topics (e.g., Tree Terminology, Error Classification, Variable Naming Rules). When `code_writing` is requested, the system automatically routes to real coding topics in that chapter (e.g., dictionary manipulation in Chapter 8) to prevent hallucinated data structure / tree traversal problems.
- **Strict Prerequisite Scoping & Invariant Filters** — Enforces course syllabus boundaries forbidding advanced syntax before taught (e.g., no lists/matrices before Ch 7, no dictionaries before Ch 8, no `def` before Ch 9). Automated validation filters reject multi-line loop short answers and inverted logic hallucinations.
- **User Progress & Topic Mastery Dashboard** — Track topic stats, overall accuracy, attempt counts, and earn "Strong Topic" badges ($\ge 80\%$ accuracy across $\ge 10$ attempts). Monotonic request IDs prevent out-of-order race conditions when switching courses.
- **Exam 1 & Exam 2 Practice** — Scoped code-writing prep for midterm and final exams with embedded reference formula sheets.
- **Module Notes** — Reference guides for all 12 course modules with links directly to topic review notes.

### General & Platform
- **Full Light & Dark Theme System** — Complete dual-theme support with persistent `localStorage` and `theme-change` event synchronization across tabs, WCAG AAA compliant text contrast, Texas A&M authentic maroon (`#500000`), and dedicated contrast borders.
- **Account Management & Right to be Forgotten (`/account`)** — Dedicated account settings page allowing users to review account status, view permissions, and permanently delete their account with cascading transactional cleanup.
- **Google OAuth & TAMU Restriction** — Secure sign-in powered by Neon Auth, restricted exclusively to `@tamu.edu` accounts.
- **Recruiter / Demo Mode** — Pass key authorization allowing guest evaluation without a TAMU email (`?demo=<token>`).
- **User Feedback System** — Submit bug reports and suggestions directly to PostgreSQL with built-in IP rate limiting (3 submissions per 10 min).
- **Legal & Compliance Suite** — Full legal documentation including Privacy Policy (`/privacy-policy`), Terms & Conditions (`/terms-and-conditions`), and Cookie Policy (`/cookie-policy`).

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 (Vite), React Router v7, Tailwind CSS 3.4 & Vanilla CSS design system |
| **Python Engine** | Pyodide (WebAssembly + Web Workers) |
| **Backend** | Node.js, Express (v5) |
| **Database** | PostgreSQL (NeonDB) with `pgvector` extension |
| **AI / LLM** | OpenRouter API (DeepSeek V4 Flash / OpenAI GPT-5.6 Luna) |
| **Embeddings** | Custom embedding pipeline (`backend/llm/embed.js`, `openai/text-embedding-3-small` 1536d) |
| **Auth** | Neon Auth (`@neondatabase/auth`, `@tamu.edu` restricted + Demo Token bypass) |
| **Deployment** | Render |

---

## Project Structure

```
.
├── backend/
│   ├── config/
│   │   └── getenv.js             # Environment variable helpers
│   ├── llm/
│   │   ├── embed.js              # Embedding pipeline for pgvector RAG
│   │   ├── topics.csv            # Source topic data & contexts
│   │   └── *.txt                 # LLM instruction prompts per question type
│   └── server.js                 # Express API server (RAG, auth, stats, feedback, account deletion)
└── frontend/
    ├── public/
    │   └── pyodide.worker.js     # Web worker running Pyodide Wasm Python runner
    └── src/
        ├── components/           # Shared components (Navbar, ExamQuizzer, ThemeToggle, etc.)
        ├── context/
        │   └── QuizFetchContext.jsx  # Global prefetching & background fetch queue
        ├── pages/
        │   ├── engr102/          # ENGR 102 module notes, topic quizzer, & exam prep
        │   │   ├── ENGR102Exam1.jsx
        │   │   ├── ENGR102Exam2.jsx
        │   │   ├── ENGR102Home.jsx
        │   │   ├── ENGR102TopicQuizzer.jsx
        │   │   └── ModulePage.jsx
        │   ├── other/
        │   │   └── stdinTutorialPage.jsx  # Interactive input() guide
        │   ├── AccountPage.jsx   # Account settings & permanent data deletion
        │   ├── CookiePolicy.jsx  # Cookie & local storage policy
        │   ├── Feedback.jsx      # User feedback submission page
        │   ├── HomePage.jsx      # Home dashboard & course selector
        │   ├── LoginPage.jsx     # Google OAuth & Demo sign-in
        │   ├── NotFoundPage.jsx  # 404 error page
        │   ├── PrivacyPolicy.jsx # Privacy policy
        │   ├── TermsConditions.jsx # Terms and conditions
        │   └── UserProfile.jsx   # User progress analytics & topic mastery stats
        ├── scripts/              # Auth client, demo mode, and helpers
        └── styles/               # Styling files and themes
```

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/engr102/quiz/question` | Generate a quiz question via RAG + LLM (supports `isFirstQuestion` routing and concept fallback) |
| `POST` | `/api/engr102/quiz/check_answer` | AI-grade code writing or short answer response with canary token verification |
| `GET` | `/api/engr102/:chapter/num_topics` | Get topic count for a chapter (cached in server memory) |
| `GET` | `/api/:course/topics/availability` | Fetch conceptual vs coding topic availability flags across all chapters for course UI rendering |
| `POST` | `/api/stats/record` | Record question attempt and accuracy to `user_topic_progress` |
| `GET` | `/api/stats/:course/:email` | Fetch progress dashboard analytics joined with `<course>topics` |
| `DELETE` | `/api/account` | Transactionally cascade-delete all user topic progress, feedback submissions, and Neon Auth user records |
| `POST` | `/api/feedback` | Submit user feedback (rate-limited: 3 submissions per 10 min) |

---

## How the RAG Pipeline Works

1. **Embedding & Storage**: Course curriculum topics and prerequisite boundaries are pre-embedded into 1536-dimensional vectors using `openai/text-embedding-3-small` and stored in PostgreSQL using `pgvector`.
2. **Semantic Retrieval**: When a question is generated, the query context is converted to vector space via `embedQuery()`, and a cosine distance query (`1 - (embedding <=> query_vector)`) retrieves the exact topic context from `engr102topics`.
3. **Smart Concept Routing**: Topics marked with `is_concept = TRUE` (e.g. Tree Terminology) are automatically routed away from `code_writing` to practical coding topics in the same chapter or gracefully defaulted to `multiple_choice`.
4. **Prompt Augmentation**: Retrieved context, reference questions, and chapter boundary constraints are injected into the system instructions.
5. **Constrained Generation**: The LLM outputs a strictly formatted JSON question matching the question type schema without referencing future course concepts.

---

## Performance & Cost Optimization

1. **Hybrid Model Routing**: Uses **OpenAI GPT-5.6 Luna** for the first question to deliver fast start times, and **DeepSeek V4 Flash (`:nitro`)** for ongoing questions at ~$0.00017/question — cutting per-session API cost by ~50% compared to the previous `gpt-4o-mini` baseline.
2. **Zero-Waste Hover Prefetching**: Prefetches the first question during mouse hover (`onMouseEnter`) or mobile touch (`onTouchStart`), absorbing the physical click delay so the quiz starts in 0 ms.
3. **Double-Hop Elimination**: Combines topic metadata discovery and question generation into one unified request. Benchmarked end-to-end latency reduction: **44% faster** (2.2s → 1.2s avg, 1.79× speedup over the previous 2-round-trip architecture).
4. **Monotonic Request ID Race-Condition Guard**: User Profile and analytics use monotonic sequence IDs (`activeFetchIdRef`) to automatically discard stale out-of-order fetch responses during rapid course switching.
5. **Prerequisite & Invariant Filtering**: Programmatic backend filters discard hallucinated multi-line loop short answers, premature matrix references, and contradictory logic before responses reach the user.
6. **In-Memory Caching**: Pre-warms static curriculum topics and LLM prompt templates into server memory on boot, eliminating 500–1,500 ms remote database queries.

---

## Security Hardening

1. **Prompt Injection Defense (LLM Layer)**: User-submitted code answers pass through a multi-layer security pipeline before reaching the LLM:
   - **Regex-based input filter**: Detects and blocks 12+ common prompt injection patterns (e.g. `ignore previous instructions`, `you are now a`, `return {"is_correct": true}`) before the request ever reaches the AI.
   - **Canary token verification**: A cryptographically random token (regenerated on each server boot) is embedded in the system prompt. The LLM must echo it back in its response — if the token is missing or altered, the response is discarded as potentially hijacked.
   - **Output schema validation**: Enforces strict type checks (`is_correct` must be boolean, `explanation` must be string) to reject malformed or manipulated LLM outputs.
2. **Transactional Account & Data Deletion**: Cascading user deletion wrapped in an atomic PostgreSQL transaction (`BEGIN ... COMMIT / ROLLBACK`), ensuring `user_topic_progress`, `feedback`, and `neon_auth."user"` records are cleanly purged with no orphaned rows.
3. **SQL Injection Prevention (Course Allowlist)**: Dynamic table name construction (`${course}topics`) is replaced with a strict allowlist map (`COURSE_TABLE_MAP`). Only pre-registered course identifiers resolve to table names — arbitrary input never reaches SQL.
4. **CORS Origin Allowlist**: Replaces permissive wildcard headers with an explicit origin allowlist (production Render domain + local dev servers). Unlisted origins receive no CORS header, causing the browser to block the request.

---

## Local Development

### Prerequisites
- Node.js 18+
- A PostgreSQL database with `pgvector` enabled and `engr102topics`, `user_topic_progress`, and `feedback` tables
- An [OpenRouter](https://openrouter.ai) API key
- A [Neon](https://neon.tech) database project with Neon Auth configured

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
VITE_NEON_AUTH_URL=https://your-neon-auth-url.neon.tech/neondb/auth
VITE_DEMO_TOKEN=your_demo_token
```

*(Note: In local development, the Vite dev server proxies `/api` requests directly to `http://localhost:3000` via `vite.config.js`.)*

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
