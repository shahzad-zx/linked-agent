import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { findUserByEmail, findUserById, createUser } from "./db.js";
import { requireAuth } from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
const MODEL = "llama-3.3-70b-versatile";

if (!GROQ_API_KEY) {
  console.error("Missing GROQ_API_KEY in .env — get a free one at https://console.groq.com/keys");
  process.exit(1);
}
if (!JWT_SECRET) {
  console.error("Missing JWT_SECRET in .env — set it to any long random string.");
  process.exit(1);
}

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // set true once you deploy behind HTTPS
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

// ---------- AUTH ----------

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: "Name, email, and password are all required." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "An account with that email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
  });

  const token = signToken(user.id);
  res.cookie("token", token, COOKIE_OPTS);
  res.status(201).json({ user: publicUser(user) });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email?.trim() || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ error: "Invalid email or password." });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid email or password." });

  const token = signToken(user.id);
  res.cookie("token", token, COOKIE_OPTS);
  res.json({ user: publicUser(user) });
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token", COOKIE_OPTS);
  res.json({ ok: true });
});

app.get("/api/auth/me", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ user: null });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await findUserById(payload.userId);
    if (!user) return res.status(401).json({ user: null });
    res.json({ user: publicUser(user) });
  } catch {
    res.status(401).json({ user: null });
  }
});

// ---------- GENERATE (protected) ----------

const SYSTEM_PROMPT = `You write LinkedIn posts for the user based on the topic and angle they provide.

Rules for every post:
- Hook-driven opening line (no "I'm excited to announce")
- Short paragraphs, max 2 sentences each, generous whitespace
- Use **word** for bold emphasis on key phrases (2-4 per post, not more)
- End with one clear call to action
- 3-5 relevant hashtags, placed on their own line at the end
- No corporate jargon ("synergy", "paradigm shift", "leverage")
- Sound like a real person, not a marketing bot

Respond with ONLY raw JSON, no markdown fences, no preamble:
{"post": "full post text with \\n for line breaks", "hashtags": ["#Tag1","#Tag2"]}`;

app.post("/api/generate", requireAuth, async (req, res) => {
  const { history } = req.body;
  if (!Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: "Missing or invalid 'history' array." });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1000,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", response.status, errText);
      return res.status(502).json({ error: `Groq API returned ${response.status}` });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || "";
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse model output as JSON:", raw);
      return res.status(502).json({ error: "Model returned unexpected format." });
    }

    res.json(parsed);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error while contacting Groq API." });
  }
});

app.listen(PORT, () => {
  console.log(`LinkedAgent backend running at http://localhost:${PORT}`);
});