import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Eye, MessagesSquare, ShieldCheck, ArrowRight, ChevronRight, Check } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const SERVICES = [
  {
    id: "tone",
    icon: Zap,
    title: "AI Tone Optimization",
    short: "Tailor hooks & content formatting specifically for target LinkedIn audiences.",
    details: [
      "Select from multi-preset tone guides (e.g., open-to-work milestones, technical deep dives).",
      "Draft engaging hooks designed to capture professional feed scrolling attention.",
      "Optimized paragraph breaks and bullet point generation based on classic high-engagement layouts."
    ]
  },
  {
    id: "preview",
    icon: Eye,
    title: "Real LinkedIn Feed Preview",
    short: "Visual validation card rendering your draft exactly how it looks live.",
    details: [
      "Dynamic mockup showcasing profile initials, hashtags, and social engagement buttons.",
      "Ensures line breaks, text lengths, and emoji placements fit within LinkedIn UI limits.",
      "No guessing where the 'see more' truncation will occur."
    ]
  },
  {
    id: "chat",
    icon: MessagesSquare,
    title: "Iterative Edit by Talking",
    short: "Revise draft copies in-place via simple conversational prompts.",
    details: [
      "Refine outputs seamlessly (e.g. 'make it punchier', 'remove two hashtags').",
      "Context-aware generation preserves approved sections while editing focus areas.",
      "Fast response cycles powered by Groq's high-speed API connections."
    ]
  },
  {
    id: "privacy",
    icon: ShieldCheck,
    title: "Absolute Session Privacy",
    short: "Draft in full comfort. Your thoughts do not persist on outside servers.",
    details: [
      "No databases store your raw ideas or drafts permanently.",
      "Everything resides within local states and browser sessions.",
      "No trackers or email newsletters to clutter your inbox."
    ]
  }
];

export default function Service() {
  const [activeService, setActiveService] = useState(SERVICES[0]);

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
          <Link to="/services" className="nav-link" style={{ color: "var(--primary)", fontWeight: 600 }}>Services</Link>
          <Link to="/about" className="nav-link">About</Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/login" className="btn-secondary" style={{ padding: "9px 16px" }}>Log in</Link>
          <Link to="/signup" className="btn-primary" style={{ padding: "9px 16px" }}>Sign up free</Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="container" style={{ padding: "80px 24px 40px", textAlign: "center", maxWidth: 800 }}>
        <motion.div variants={itemVariants} className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--primary)", textTransform: "uppercase", marginBottom: 16 }}>
          Platform Capabilities
        </motion.div>
        <motion.h1 variants={itemVariants} style={{ fontSize: 48, lineHeight: 1.1, fontWeight: 700, marginBottom: 20 }}>
          Streamlining your professional <span style={{ color: "var(--primary)" }}>writing workflow</span>.
        </motion.h1>
        <motion.p variants={itemVariants} style={{ color: "var(--text-dim)", fontSize: 17, lineHeight: 1.6 }}>
          Explore the features designed to save you hours of writing blocks and visual double-checking.
        </motion.p>
      </header>

      {/* CAPABILITIES DETAILS LAYOUT */}
      <section className="container" style={{ padding: "40px 24px 80px", flexGrow: 1 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: 40,
          background: "var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: 20,
          padding: 32,
          boxShadow: "var(--shadow-lg)",
        }}>
          {/* Left Column: Interactive Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>LinkedAgent Features</h2>
            {SERVICES.map((s) => {
              const isSelected = activeService.id === s.id;
              return (
                <motion.div
                  key={s.id}
                  onClick={() => setActiveService(s)}
                  whileHover={{ scale: isSelected ? 1 : 1.015 }}
                  style={{
                    padding: "16px 20px",
                    borderRadius: 12,
                    border: "1px solid",
                    borderColor: isSelected ? "var(--primary)" : "var(--line)",
                    background: isSelected ? "rgba(42, 102, 238, 0.04)" : "var(--panel)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "border-color 0.2s ease, background-color 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      color: isSelected ? "var(--primary)" : "var(--text-dim)",
                      background: isSelected ? "var(--primary-soft)" : "var(--bg-raised)",
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "color 0.2s ease, background 0.2s ease",
                    }}>
                      <s.icon size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: isSelected ? "var(--text)" : "var(--text-dim)" }}>
                        {s.title}
                      </h3>
                      <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 2, display: "none" }}>
                        {s.short}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{
                    color: isSelected ? "var(--primary)" : "var(--line)",
                    transform: isSelected ? "translateX(4px)" : "none",
                    transition: "transform 0.2s ease, color 0.2s ease",
                  }} />
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Animation Panel */}
          <div style={{
            borderLeft: "1px solid var(--line)",
            paddingLeft: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "var(--primary-soft)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <activeService.icon size={16} />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700 }}>{activeService.title}</h3>
                </div>

                <p style={{ color: "var(--text-dim)", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
                  {activeService.short}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {activeService.details.map((detail, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{
                        marginTop: 4,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: "rgba(16, 185, 129, 0.15)",
                        color: "var(--success)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.5 }}>
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
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
