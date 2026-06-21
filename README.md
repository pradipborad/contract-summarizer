# ContractClear — AI Contract Summarizer

Upload any contract → get a plain-English summary, red flags, obligations, and key dates.
Built with Next.js + Google Gemini AI. **100% free to run.**

---

## Tech Stack

| Layer    | Tool                     | Cost         |
|----------|--------------------------|--------------|
| Frontend | Next.js (React)          | Free         |
| Backend  | Next.js API Routes       | Free         |
| AI       | Google Gemini 1.5 Flash  | Free (1,500 req/day) |
| PDF      | pdf.js (browser)         | Free         |
| Hosting  | Vercel                   | Free         |

---

## Setup (5 minutes)

### 1. Get your FREE Gemini API key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key

### 2. Install & run locally

```bash
# Clone or download this project, then:
cd contract-summarizer

# Install dependencies
npm install

# Create your environment file
cp .env.local.example .env.local

# Open .env.local and paste your Gemini API key:
# GEMINI_API_KEY=your_actual_key_here

# Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) — the app is running!

---

## Deploy to Vercel (Free)

Vercel is the easiest way to host Next.js apps — and it's free.

### Option A: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. When asked about environment variables, add `GEMINI_API_KEY`.

### Option B: Deploy via GitHub

1. Push this project to a GitHub repo
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **"New Project"** → import your GitHub repo
4. Under **Environment Variables**, add:
   - Key: `GEMINI_API_KEY`
   - Value: your Gemini API key
5. Click **Deploy**

Your app will be live at `https://your-project.vercel.app` in ~1 minute.

---

## Project Structure

```
contract-summarizer/
├── pages/
│   ├── _app.js           # App wrapper (loads global CSS)
│   ├── index.js          # Main frontend UI
│   └── api/
│       └── summarize.js  # Node.js backend — calls Gemini API
├── styles/
│   └── globals.css       # Global styles
├── public/               # Static assets
├── package.json
├── next.config.js
├── .env.local.example    # Copy this to .env.local
└── README.md
```

---

## How It Works

```
User uploads PDF/pastes text
        ↓
Browser extracts text (pdf.js — no server needed)
        ↓
Text sent to /api/summarize (Next.js API route)
        ↓
Node.js backend calls Gemini 1.5 Flash (API key stays SECRET on server)
        ↓
Gemini returns structured JSON analysis
        ↓
Frontend displays: summary, red flags, obligations, dates, questions
```

**Security**: Your Gemini API key is stored in `.env.local` and only used on the server side. It is never sent to the browser.

---

## What the AI Analyzes

- **Risk Score** (1–10) — overall contract risk level
- **Plain-English Summary** — what the contract actually says
- **Red Flags** — unusual, risky, or one-sided clauses (severity: high/medium/low)
- **Key Obligations** — what you must do under this agreement
- **Important Dates** — deadlines, notice periods, renewal dates
- **Questions to Ask** — smart questions before you sign

---

## Gemini Free Tier Limits

| Limit               | Amount       |
|---------------------|--------------|
| Requests per day    | 1,500        |
| Tokens per minute   | 1,000,000    |
| Credit card needed  | No           |
| Expires             | Never        |

1,500 requests/day is plenty for an MVP and early customers.

When you're ready to scale, upgrade to Gemini API paid tier (~$0.075 per 1M tokens — very cheap).

---

## Monetization Ideas

- **Freemium**: 3 free analyses/month → $9–29/mo for unlimited
- **Pay-per-use**: credits system (e.g. $5 for 20 analyses)
- **Team plans**: $49–99/mo for agencies or law firms
- **White-label**: sell the codebase to businesses

Use [Lemon Squeezy](https://www.lemonsqueezy.com) or [Stripe](https://stripe.com) for payments.

---

## Selling on Flippa / Acquire.com

To maximize your listing value:
1. Get at least 5–10 paying users before listing
2. Show MRR proof (even $50–200/mo = much higher multiple)
3. Include traffic screenshots (Google Analytics)
4. Document the codebase cleanly
5. List as "AI SaaS for legal document analysis" — target price: $3K–20K depending on MRR

---

## License

MIT — do whatever you want with it.
