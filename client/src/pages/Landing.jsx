import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Eye, CheckCircle2, Zap, Lock, Wand2, ChevronDown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  { icon: Zap, title: "Free, not freemium", text: "Runs on Groq's free tier. No trial countdown, no card on file, no upsell after day seven." },
  { icon: Eye, title: "See it before it's real", text: "Every draft renders as an actual LinkedIn post card — profile, hashtags, engagement bar — so there's no guessing." },
  { icon: Wand2, title: "Edit by talking, not retyping", text: "\"Make it shorter\" or \"punchier hook\" — tell it what's wrong and it rewrites, in place." },
  { icon: Lock, title: "You own the account", text: "Your login, your drafts, your server. Nothing about your content sits on someone else's growth-hacking platform." },
];

const FAQS = [
  {
    q: "Do I need to pay for anything?",
    a: "No. Sign-up is free, and post generation runs on Groq's free API tier — no credit card required at any step.",
  },
  {
    q: "Does this actually publish to LinkedIn for me?",
    a: "Not automatically. Once you approve a draft, you copy the final text and paste it into LinkedIn yourself. True one-click publishing needs LinkedIn's own approved API access, which is a separate step outside this tool.",
  },
  {
    q: "What happens to my drafts?",
    a: "They live only in your session while you're working — nothing is stored long-term unless you choose to save it yourself.",
  },
  {
    q: "Can I change the writing style?",
    a: "Yes — the generation rules live in one place on the backend, so you can tune tone, hashtag count, or structure to match how you actually write.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--line)", padding: "20px 0" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none", border: "none", color: "var(--ink)", width: "100%",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          cursor: "pointer", fontSize: 15, fontWeight: 600, textAlign: "left", padding: 0,
        }}
      >
        {q}
        <ChevronDown size={18} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", flexShrink: 0, marginLeft: 12 }} />
      </button>
      {open && <p style={{ color: "var(--ink-dim)", fontSize: 14, lineHeight: 1.6, marginTop: 12, marginBottom: 0 }}>{a}</p>}
    </div>
  );
}

function MockPostCard({ badge }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 18, color: "#1A1A1A", boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--amber), var(--amber-soft))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#14100A", flexShrink: 0,
        }}>YN</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>Your Name</div>
          <div style={{ fontSize: 11, color: "#8A8A92" }}>Now · 🌐</div>
        </div>
        {badge && (
          <span style={{
            marginLeft: "auto", fontSize: 10, fontWeight: 700, color: "#14100A",
            background: "var(--amber-soft)", padding: "3px 8px", borderRadius: 6, letterSpacing: 0.4,
          }}>{badge}</span>
        )}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.55 }}>
        Shipped something today that I almost gave up on twice.
        <br /><br />
        The bug wasn't in my code — it was in my <b>assumption</b> about how the API responded.
        <br /><br />
        Lesson: when the docs and the behavior disagree, trust the behavior.
      </div>
      <div style={{ color: "#0A66C2", fontSize: 12, marginTop: 10 }}>#buildinpublic #webdev #reactjs</div>
      <div style={{ display: "flex", gap: 18, paddingTop: 10, marginTop: 10, borderTop: "1px solid #E8E8EA", fontSize: 11, color: "#6B6B72" }}>
        <span>👍 Like</span><span>💬 Comment</span><span>🔁 Repost</span>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* NAV */}
      <nav className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, var(--amber), var(--amber-soft))" }} /> */}
          {/* <img src="./assets/logo.png" alt="Logo" /> */}
          <span style={{ fontWeight: 700, fontSize: 17, fontFamily: "'Space Grotesk', sans-serif" }}>LinkedInAgent</span>
        </div>

        {/* Navigation Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link to="/" className="nav-link" style={{ color: "var(--primary)", fontWeight: 600 }}>Home</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/about" className="nav-link">About</Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/dashboard" className="btn-primary" style={{ padding: "9px 16px" }}>Go to Dashboard</Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="container" style={{ padding: "60px 24px 40px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48, alignItems: "center" }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.2 }}
        >
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--amber)", textTransform: "uppercase", marginBottom: 16 }}>
            Free · No card · Your own account
          </div>
          <h1 style={{ fontSize: 44, lineHeight: 1.1, fontWeight: 700, marginBottom: 20 }}>
            Draft LinkedIn posts. <span style={{ color: "var(--amber)" }}>Preview them like real posts.</span> Approve before anything goes anywhere.
          </h1>
          <p style={{ color: "var(--ink-dim)", fontSize: 16, lineHeight: 1.6, marginBottom: 28, maxWidth: 480 }}>
            Give it a topic and an angle. It writes the hook, the structure, the hashtags — you see exactly
            what it'll look like as a post before you ever copy a word of it.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link to="/dashboard" className="btn-primary" style={{ padding: "14px 26px", fontSize: 15 }}>
              <Sparkles size={17} /> Start for free
            </Link>
            <a href="#how-it-works" className="btn-secondary" style={{ padding: "14px 22px", fontSize: 15 }}>
              See how it works
            </a>
          </div>
        </motion.div>

        <motion.div
          style={{ position: "relative" }}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.4 }}
        >
          <MockPostCard badge="PREVIEW" />
        </motion.div>
      </header>

      {/* SOCIAL PROOF STRIP */}
      <div style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "24px 0" }}>
        <p className="container mono" style={{ textAlign: "center", fontSize: 12, color: "var(--ink-faint)", letterSpacing: "0.08em" }}>
          BUILT FOR JOB SEEKERS · DEVELOPERS · CREATORS WHO'D RATHER APPROVE THAN GUESS
        </p>
      </div>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="container" style={{ padding: "80px 24px" }}>
        <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 56px" }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--amber)", textTransform: "uppercase", marginBottom: 12 }}>
            How it works
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 700 }}>Three steps. You're in control at every one.</h2>
        </div>

        {[
          { step: "01", title: "Tell it what happened", text: "A topic, a rough idea, a shipped feature, a job update — a sentence or two is enough. Pick an angle and it does the structuring." },
          { step: "02", title: "See the real preview", text: "Not a text box — an actual post card, styled like it'll appear on LinkedIn, hashtags and all." },
          { step: "03", title: "Approve, edit, or reroll", text: "Like it? Approve and copy. Close but not quite? Tell it what to change. Not feeling the angle? Get a completely different one." },
        ].map((item, i) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: 40, alignItems: "center", marginBottom: 64,
              direction: i % 2 === 0 ? "ltr" : "rtl",
            }}
          >
            <div style={{ direction: "ltr" }}>
              <div className="mono" style={{ fontSize: 13, color: "var(--amber)", marginBottom: 10 }}>{item.step}</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{item.title}</h3>
              <p style={{ color: "var(--ink-dim)", fontSize: 15, lineHeight: 1.6 }}>{item.text}</p>
            </div>
            <div style={{ direction: "ltr" }}>
              <MockPostCard badge={i === 0 ? "DRAFT" : i === 1 ? "PREVIEW" : "APPROVED"} />
            </div>
          </motion.div>
        ))}
      </section>

      {/* FEATURE GRID */}
      <section style={{ background: "var(--bg-raised)", padding: "80px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 48px" }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--amber)", textTransform: "uppercase", marginBottom: 12 }}>
              Why this, not a subscription
            </div>
            <h2 style={{ fontSize: 30, fontWeight: 700 }}>Everything a paid tool charges for, minus the paying part</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                whileHover={{ y: -6, scale: 1.015, boxShadow: "0 10px 25px rgba(245, 158, 11, 0.08)", borderColor: "var(--amber)" }}
                style={{
                  background: "var(--panel)",
                  border: "1px solid var(--line)",
                  borderRadius: 14,
                  padding: 24,
                  cursor: "pointer",
                  transition: "border-color 0.2s, box-shadow 0.2s"
                }}
              >
                <f.icon size={22} color="var(--amber)" style={{ marginBottom: 14 }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: "var(--ink-dim)", fontSize: 14, lineHeight: 1.6 }}>{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container" style={{ padding: "80px 24px", maxWidth: 720 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>Frequently asked</h2>
        <p style={{ color: "var(--ink-dim)", textAlign: "center", marginBottom: 32 }}>The honest answers, not the marketing ones.</p>
        {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "60px 24px 100px" }}>
        <div className="container" style={{
          background: "linear-gradient(135deg, rgba(255,122,0,0.12), rgba(255,179,71,0.04))",
          border: "1px solid var(--line)", borderRadius: 20, padding: "56px 40px", textAlign: "center",
        }}>
          <CheckCircle2 size={28} color="var(--amber)" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Stop staring at the blank post box.</h2>
          <p style={{ color: "var(--ink-dim)", marginBottom: 28 }}>Free account, first draft in under a minute.</p>
          <Link to="/dashboard" className="btn-primary" style={{ padding: "14px 28px", fontSize: 15 }}>
            <Sparkles size={17} /> Go to Dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--line)", padding: "28px 24px" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>© {new Date().getFullYear()} LinkedAgent. Built as a personal project.</span>
          <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>Not affiliated with LinkedIn Corporation.</span>
        </div>
      </footer>
    </motion.div>
  );
}