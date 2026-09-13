# FitScore ⚡

> **Know your fit before you apply.**  
> An AI-powered resume analyzer that compares your resume against any job description, calculates an alignment score, identifies verified qualifications & skill gaps, and gives actionable recommendations to maximize your interview chances.

---

## 📌 Overview

**FitScore** is a full-stack web application designed to help job seekers optimize their job applications. By leveraging Google's Gemini generative AI models, FitScore parses resumes (PDF/DOCX), compares extracted skills and experience against targeted job descriptions, and generates structured matching reports in seconds.

### 🌟 Key Capabilities
- **Multi-Format Resume Parsing**: Upload resumes in PDF or DOCX format (up to 5MB) with instant text extraction and client-side validation.
- **Editable Extraction Review**: Review and correct parsed resume content in an editable editor before running analysis to account for OCR or layout quirks.
- **Structured AI Match Scoring**: Generates an alignment score (0–100%), highlights verified qualifications (`matchedSkills`), isolates key missing requirements (`missingSkills`), and provides a plain-English AI verdict.
- **Visual Analytics**: Interactive responsive radial gauge, progress bars, and color-coded score bands (*Excellent*, *Solid*, *Moderate*, *Stretch*).
- **Application History & Archive**: Authenticated users can save match reports, categorize by role labels, search by keywords, and filter by score tiers.
- **Secure Authentication & Rate Limiting**: JWT-based session management, bcrypt password hashing, IDOR protection on private history records, and IP rate limiting protecting Gemini quotas.
- **100% Mobile & Desktop Responsive**: Fluid, responsive design tested across 320px mobile screens, tablets, and wide desktop displays with zero horizontal overflow.

---

## 🛠️ Tech Stack

### Frontend (`/front-end`)
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Base UI](https://base-ui.com/) & [shadcn/ui](https://ui.shadcn.com/) primitives
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **HTTP Client**: [Axios](https://axios-http.com/) with automatic retry and auth interceptors
- **Font**: [Inter](https://fonts.google.com/specimen/Inter) via `next/font`

### Backend (`/back-end`)
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **AI Engine**: [Google Gen AI SDK (`@google/genai`)](https://github.com/googleapis/genai-js) powered by `gemini-3.6-flash`
- **Document Extractors**: [`pdf-parse`](https://www.npmjs.com/package/pdf-parse) (PDF) & [`mammoth`](https://www.npmjs.com/package/mammoth) (DOCX)
- **File Handling**: [`multer`](https://www.npmjs.com/package/multer) with strict size and MIME type guards
- **Security & Auth**: [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken), [`bcryptjs`](https://www.npmjs.com/package/bcryptjs), [`cors`](https://www.npmjs.com/package/cors), [`express-rate-limit`](https://www.npmjs.com/package/express-rate-limit)

---

## 📂 Project Structure

```text
FitScore/
├── back-end/
│   ├── src/
│   │   ├── config/             # MongoDB connection (db.js)
│   │   ├── controllers/        # Request handlers (auth, resume, analysis)
│   │   ├── middleware/         # Auth guard, file upload limits, centralized error handler
│   │   ├── models/             # Mongoose schemas (User, Analysis)
│   │   ├── routes/             # Express API routes (authRoutes, resumeRoutes, analysisRoutes)
│   │   ├── services/           # Isolated business logic (geminiService, parserService)
│   │   ├── utils/              # Standard response helper (responseHandler.js)
│   │   ├── app.js              # Express app setup & rate-limit configuration
│   │   └── index.js            # Server listener entry point
│   ├── .env.example            # Backend environment variables template
│   ├── package.json
│   └── nodemon.json
│
├── front-end/
│   ├── src/
│   │   ├── app/                # Next.js App Router (layout, scanner page, history page)
│   │   ├── components/         # Shared UI (Header, Button, Card, Badge, Dialog, Charts)
│   │   ├── context/            # AuthContext (JWT storage, login/logout, user session)
│   │   ├── features/
│   │   │   ├── auth/           # AuthDialog, LoginForm, RegisterForm, auth API client
│   │   │   ├── history/        # HistoryView, SearchBar, HistoryCard, Preview & Delete Dialogs
│   │   │   └── scanner/        # ScannerView, UploadSection, AnalyzeSection, ResultSection
│   │   └── lib/                # Axios instance with interceptors, score bands utility
│   ├── .env.example            # Frontend environment variables template
│   ├── .env.local              # Local development overrides (gitignored)
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
│
└── README.md                   # Project documentation
```

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api`.

### 1. Authentication — `/api/auth`
| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public (Rate-limited: 20 req/15m) | Register a new user (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public (Rate-limited: 20 req/15m) | Authenticate user, return signed JWT & user details |
| `GET` | `/api/auth/me` | Protected (`Bearer <token>`) | Get logged-in user profile details |

### 2. Resume Extraction — `/api/resume`
| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `POST` | `/api/resume/upload` | Public | Upload a single file (`.pdf` or `.docx`, max 5MB) and receive parsed plain text |

### 3. Analysis & History — `/api/analysis`
| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `POST` | `/api/analysis/analyze` | Public (Rate-limited: 10 req/15m) | Analyze `resumeText` + `jdText` via Gemini, return structured score & skills |
| `POST` | `/api/analysis/save` | Protected (`Bearer <token>`) | Save an analysis result under the authenticated user account |
| `GET` | `/api/analysis/history` | Protected (`Bearer <token>`) | Fetch all saved analyses for the authenticated user (sorted newest first) |
| `GET` | `/api/analysis/history/:id` | Protected (`Bearer <token>`) | Retrieve single saved analysis details (includes IDOR ownership verification) |
| `DELETE` | `/api/analysis/history/:id` | Protected (`Bearer <token>`) | Delete a saved analysis (includes IDOR ownership verification) |

---

## 🎯 Score Band Methodology

Match scores range from `0` to `100` and are categorized into four intuitive score bands:

| Score Range | Band Label | Status Headline | Accent Color |
|---|---|---|---|
| **85 – 100%** | `Excellent match` | *"You're a strong fit for this role."* | Emerald (`#10b981`) |
| **65 – 84%** | `Solid match` | *"You're a strong candidate with room to grow."* | Blue (`#2563eb`) |
| **40 – 64%** | `Moderate match` | *"You meet some key requirements for this position."* | Amber (`#f59e0b`) |
| **0 – 39%** | `Stretch role` | *"This role requires skills outside your current profile."* | Rose (`#ef4444`) |

---

## ⚙️ Environment Variables

### Backend Configuration (`back-end/.env`)
Create a `.env` file in the `back-end` directory (reference [`.env.example`](file:///d:/Full%20Stack%20Projects/FitScore/back-end/.env.example)):

```env
PORT=7777
MONGO_URI=mongodb://localhost:27017/FitScore
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_super_secret_jwt_key_here
```

### Frontend Configuration (`front-end/.env.local`)
Create a `.env.local` file in the `front-end` directory for local development (reference [`.env.example`](file:///d:/Full%20Stack%20Projects/FitScore/front-end/.env.example)):

```env
# Points to local backend server
NEXT_PUBLIC_API_BASE_URL=http://localhost:7777/api
```

*(Optional) For remote or devtunnel environments:*
```env
NEXT_PUBLIC_API_BASE_URL=https://your-tunnel-url.inc1.devtunnels.ms/api
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or via MongoDB Atlas)
- [Google AI Studio](https://aistudio.google.com/) API Key (for Gemini access)

---

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd FitScore
```

---

### Step 2: Setup and Run the Backend
```bash
cd back-end

# 1. Install dependencies
npm install

# 2. Configure environment variables
# Copy .env.example to .env and insert your MongoDB URI & GEMINI_API_KEY
cp .env.example .env

# 3. Start development server with nodemon (runs on port 7777)
npm run dev
```

The backend server should log:
```
MongoDB Connected: localhost
Server listening on port 7777
```

---

### Step 3: Setup and Run the Frontend
Open a new terminal window:
```bash
cd front-end

# 1. Install dependencies
npm install

# 2. Configure local environment variables
# Copy .env.example to .env.local
cp .env.example .env.local

# 3. Start Next.js development server (runs on port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start scanning!

---

## 📱 Responsive Testing & Verification

FitScore's user interface is thoroughly tested and verified across all standard responsive breakpoints:
- **Mobile (320px – 480px)**: Compact navbar, stacked dropzone and upload actions, vertical editor cards, horizontal touch-scrolling filter track, and full-width dialog actions.
- **Tablet (768px – 1024px)**: 2-column history card grid, auto-expanding filters, balanced preview modal viewports.
- **Desktop (1280px+)**: 3-column card grid, side-by-side resume vs. job description comparison textareas, and spacious radial gauge analytics.

Run the frontend typecheck anytime:
```bash
cd front-end
npx tsc --noEmit
```

---

## 🔒 Security Best Practices Implemented
- **IDOR Protection**: Saved analysis retrieval and deletion verify `analysis.userId.toString() === req.user._id.toString()` before performing operations.
- **Strict Rate Limiting**: Dedicated rate limiter for `/api/analysis/analyze` prevents API quota drain.
- **Prompt Injection Defense**: Text extracted from resumes and job descriptions is treated as untrusted data and wrapped in delimiter blocks within Gemini prompts.
- **Input Sanitization & Limits**: Job description inputs and resume file sizes are capped server-side to prevent memory exhaustion.

---

## 📄 License
This project is licensed under the ISC License.
