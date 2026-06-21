import Groq from "groq-sdk";

// Increase Vercel function timeout to 60 seconds
export const maxDuration = 60;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  if (!text || text.trim().length < 50) {
    return res.status(400).json({
      error: "Contract text is too short. Please provide more content.",
    });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({
      error: "GROQ_API_KEY is not set. Add it to Vercel → Settings → Environment Variables.",
    });
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 2048,
      messages: [
        {
          role: "system",
          content:
            "You are a professional contract analyst helping non-lawyers understand legal documents. You always respond with valid JSON only — no markdown fences, no explanation, just the raw JSON object.",
        },
        {
          role: "user",
          content: `Analyze the contract below and return ONLY a valid JSON object with exactly this structure:

{
  "title": "Brief descriptive name of this contract (e.g. 'Software Development Agreement')",
  "summary": "2-3 sentence plain-English explanation of what this contract is, who it is between, and what it accomplishes",
  "keyObligations": [
    {
      "party": "Who must do this (e.g. 'You', 'The Company', 'Both parties')",
      "obligation": "Plain-English description of what they must do"
    }
  ],
  "redFlags": [
    {
      "title": "Short name for this concern",
      "description": "Plain-English explanation of why this clause is concerning or unusual",
      "severity": "high"
    }
  ],
  "importantDates": [
    {
      "label": "What this date or deadline is for",
      "value": "The date, duration, or timeframe"
    }
  ],
  "questionsToAsk": [
    "A specific question the signer should ask before agreeing"
  ],
  "riskScore": 5
}

Rules:
- keyObligations: list the 3-6 most important things the signer must do
- redFlags: flag anything unusual, one-sided, auto-renewing, IP-grabs, liability caps, broad non-competes. Severity must be exactly "high", "medium", or "low"
- importantDates: include contract length, notice periods, renewal dates, payment deadlines
- questionsToAsk: 3-5 smart questions to ask before signing
- riskScore: integer 1 (very safe) to 10 (very risky)
- If any array has nothing to report, return []
- Plain English only, no legal jargon
- Return ONLY the JSON object, nothing else

CONTRACT:
${text.substring(0, 28000)}`,
        },
      ],
    });

    const responseText = completion.choices[0]?.message?.content || "";

    // Strip any accidental markdown fences
    const cleaned = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    return res.status(200).json(parsed);

  } catch (error) {
    console.error("=== CONTRACT SUMMARIZER ERROR ===");
    console.error("Type:", error.constructor.name);
    console.error("Message:", error.message);
    console.error("=================================");

    if (error.message?.includes("401") || error.message?.includes("API key")) {
      return res.status(401).json({
        error: "Invalid Groq API key. Check GROQ_API_KEY in Vercel environment variables.",
      });
    }

    if (error.message?.includes("429") || error.message?.includes("quota") || error.message?.includes("rate")) {
      return res.status(429).json({
        error: "Too many requests. Please wait a moment and try again.",
      });
    }

    if (error instanceof SyntaxError) {
      return res.status(500).json({
        error: "AI returned an unexpected format. Please try again.",
      });
    }

    return res.status(500).json({
      error: `Analysis failed: ${error.message || "Unknown error. Check Vercel function logs."}`,
    });
  }
}
