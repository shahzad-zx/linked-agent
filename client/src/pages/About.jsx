import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Sparkles, Shield, Compass, ArrowRight } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const cardVariants = {
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(42, 102, 238, 0.12)",
    borderColor: "var(--primary)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

export default function About() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* NAV */}
      <nav className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, var(--amber), var(--amber-soft))" }} /> */}
          <Link to="/" style={{ fontWeight: 700, fontSize: 17, fontFamily: "'Space Grotesk', sans-serif" }}>LinkedAgent</Link>
        </div>

        {/* Navigation Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/about" className="nav-link" style={{ color: "var(--primary)", fontWeight: 600 }}>About</Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/login" className="btn-secondary" style={{ padding: "9px 16px" }}>Log in</Link>
          <Link to="/signup" className="btn-primary" style={{ padding: "9px 16px" }}>Sign up free</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="container" style={{ padding: "80px 24px 60px", textAlign: "center", maxWidth: 800 }}>
        <motion.div variants={itemVariants} className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--primary)", textTransform: "uppercase", marginBottom: 16 }}>
          Behind the platform
        </motion.div>
        <motion.h1 variants={itemVariants} style={{ fontSize: 48, lineHeight: 1.1, fontWeight: 700, marginBottom: 20 }}>
          We make professional <span style={{ color: "var(--primary)" }}>LinkedIn drafting</span> effortless & private.
        </motion.h1>
        <motion.p variants={itemVariants} style={{ color: "var(--text-dim)", fontSize: 17, lineHeight: 1.6, marginBottom: 32 }}>
          LinkedAgent was built with a simple conviction: you shouldn't have to sell your data, enter a credit card, or pay expensive monthly subscriptions just to structure your professional thoughts.
        </motion.p>
      </header>

      {/* CORE VALUES */}
      <section style={{ background: "var(--bg-raised)", padding: "80px 24px", flexGrow: 1 }}>
        <div className="container" style={{ maxWidth: 1000 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 30, fontWeight: 700 }}>Our Core Principles</h2>
            <p style={{ color: "var(--text-dim)", marginTop: 8 }}>What guides every design decision we make.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              {
                icon: Shield,
                title: "Absolute Privacy First",
                text: "Your drafts remain in your session. We do not store your raw inputs or sell your writing profile to advertisers. Your data remains yours.",
              },
              {
                icon: Sparkles,
                title: "AI as an Assistant, Not Autopilot",
                text: "We don't auto-post. The final card preview gives you full visual validation, requiring your intentional click to copy and publish.",
              },
              {
                icon: Compass,
                title: "Developer & Creator Centric",
                text: "Built using modern technologies with clean web standards. It's free to use because we run on Groq's superfast, accessible free-tier API.",
              },
            ].map((val, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover="hover"
                style={{
                  background: "var(--panel)",
                  border: "1px solid var(--line)",
                  borderRadius: 16,
                  padding: 30,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  transition: "border-color 0.2s ease",
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "var(--primary-soft)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}>
                  <val.icon size={22} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{val.title}</h3>
                <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{val.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM / CREATORS TIMELINE */}
      <section className="container" style={{ padding: "80px 24px" }}>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 56px" }}>
          <h2 style={{ fontSize: 30, fontWeight: 700 }}>How We Built It</h2>
          <p style={{ color: "var(--text-dim)", marginTop: 8 }}>From a weekend hack to a production-ready dashboard helper.</p>
        </div>

        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", paddingLeft: 24 }}>
          {/* Vertical Line */}
          <div style={{
            position: "absolute",
            left: 7,
            top: 10,
            bottom: 10,
            width: 2,
            background: "linear-gradient(to bottom, var(--primary) 30%, var(--amber) 100%)",
          }} />

          {[
            {
              step: "Phase 1: The Problem",
              title: "Tired of Blank Post Boxes",
              text: "We wanted a tool that helped us brainstorm hooks and formats for technical milestones without the clutter of marketing-heavy platforms.",
            },
            {
              step: "Phase 2: Local MVP",
              title: "Wrote the Prompt Backend",
              text: "Setup a lightweight Node/Express server parsing user ideas and converting them into post content and automated hashtag blocks using Groq LLaMA models.",
            },
            {
              step: "Phase 3: Visual Polish",
              title: "Added Post Previews & Animations",
              text: "Designed the client dashboard to render actual post templates dynamically, matching LinkedIn's layout perfectly so there is no guessing.",
            },
          ].map((milestone, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              style={{ position: "relative", marginBottom: 40 }}
            >
              {/* Dot */}
              <div style={{
                position: "absolute",
                left: -24,
                top: 6,
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: idx === 0 ? "var(--primary)" : idx === 1 ? "#3b82f6" : "var(--amber)",
                border: "3px solid var(--bg)",
                boxShadow: "0 0 0 3px rgba(0,0,0,0.05)",
              }} />

              <div style={{ paddingLeft: 12 }}>
                <span className="mono" style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase" }}>{milestone.step}</span>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginTop: 4, marginBottom: 8 }}>{milestone.title}</h3>
                <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{milestone.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section style={{ padding: "60px 24px 100px" }}>
        <div className="container" style={{
          background: "linear-gradient(135deg, rgba(42,102,238,0.1), rgba(245,158,11,0.05))",
          border: "1px solid var(--line)",
          borderRadius: 20,
          padding: "56px 40px",
          textAlign: "center",
          maxWidth: 900,
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Ready to write your next post?</h2>
          <p style={{ color: "var(--text-dim)", marginBottom: 28 }}>Start drafting with our intelligent tone optimization engine.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Link to="/signup" className="btn-primary" style={{ padding: "14px 28px", fontSize: 15 }}>
              Create free account <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--line)", padding: "28px 24px", marginTop: "auto" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, color: "var(--text-faint)" }}>© {new Date().getFullYear()} LinkedAgent. Built as a personal project.</span>
          <span style={{ fontSize: 13, color: "var(--text-faint)" }}>Not affiliated with LinkedIn Corporation.</span>
        </div>
      </footer>
    </motion.div>
  );
}
