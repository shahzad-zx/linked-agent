// LinkedAgent.jsx — drop this into your own Vite React app (e.g. src/components/LinkedAgent.jsx).
// It talks to your local backend (see server/server.js) instead of Anthropic directly,
// so your API key never touches the browser.


import React, { useState, useRef, useEffect } from "react";
import { Sparkles, RefreshCw, Pencil, Check, Copy, ArrowLeft, Send, Loader2, X } from "lucide-react";

// Point this at wherever your backend runs. In Vite, prefer an env var:
// create a .env file in your app root with: VITE_API_URL=http://localhost:3001
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const TONES = [
  { id: "job", label: "Open to work", hint: "Signal you're job hunting without sounding desperate" },
  { id: "technical", label: "Technical insight", hint: "Share something you built or debugged" },
  { id: "story", label: "Personal story", hint: "A lesson, turning point, or behind-the-scenes" },
  { id: "milestone", label: "Milestone", hint: "Launch, metric, or achievement worth flagging" },
];

async function callBackend(history) {
  const response = await fetch(`${API_URL}/api/generate`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  return data; // { post, hashtags }
}

export default function LinkedAgent() {
  const [stage, setStage] = useState("compose"); // compose | loading | preview | preview_error | approved
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("job");
  const [post, setPost] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [mode, setMode] = useState(null); // 'edit' | null
  const [feedback, setFeedback] = useState("");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (mode === "edit" && textareaRef.current) textareaRef.current.focus();
  }, [mode]);

  const buildOpeningPrompt = () => {
    const toneObj = TONES.find((t) => t.id === tone);
    return `Angle: ${toneObj.label} (${toneObj.hint}).\nWhat happened / what to post about: ${topic}`;
  };

  async function generate(userMsg, nextHistory) {
    setStage("loading");
    setError("");
    try {
      const result = await callBackend(nextHistory);
      setPost(result);
      setHistory([...nextHistory, { role: "assistant", content: JSON.stringify(result) }]);
      setStage("preview");
      setMode(null);
      setFeedback("");
    } catch (e) {
      setError(e.message || "Something went wrong reaching the server.");
      setStage("preview_error");
    }
  }

  const handleGenerateFirst = () => {
    if (!topic.trim()) return;
    const msg = { role: "user", content: buildOpeningPrompt() };
    generate(msg, [msg]);
  };

  const handleRegenerate = () => {
    const msg = {
      role: "user",
      content:
        "Discard that draft. Give me a completely different angle or structure for the same topic. Don't reuse the same hook or hashtags.",
    };
    generate(msg, [...history, msg]);
  };

  const handleEditSubmit = () => {
    if (!feedback.trim()) return;
    const msg = { role: "user", content: `Revise the draft with this feedback: ${feedback}` };
    generate(msg, [...history, msg]);
  };

  const handleApprove = () => setStage("approved");

  const handleCopy = async () => {
    const full = post.post + (post.hashtags?.length ? "\n\n" + post.hashtags.join(" ") : "");
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setError("Couldn't copy automatically — select the text below manually.");
    }
  };

  const resetAll = () => {
    setStage("compose");
    setTopic("");
    setPost(null);
    setHistory([]);
    setError("");
    setMode(null);
    setFeedback("");
  };

  const charCount = post ? post.post.length + (post.hashtags?.join(" ").length || 0) + 2 : 0;

  return (
    <div className="la-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .la-root {
          --bg: #FFFFFF;
          --panel: #F8FAFC;
          --line: #E2E8F0;
          --primary: #2A66EE;
          --primary-hover: #1E4BB8;
          --primary-soft: #D9E6FF;
          --text: #0F172A;
          --text-dim: #475569;
          font-family: 'Inter', sans-serif;
          background: var(--bg);
          color: var(--text);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 28px;
          max-width: 720px;
          margin: 0 auto;
          box-sizing: border-box;
          box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.04), 0 4px 6px -4px rgba(15, 23, 42, 0.04);
        }
        .la-root * { box-sizing: border-box; }
        .la-eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          color: var(--primary);
          text-transform: uppercase;
          margin-bottom: 6px;
          font-weight: 500;
        }
        .la-title {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 22px;
          margin: 0 0 20px 0;
          color: var(--text);
        }
        .la-label { font-size: 12px; color: var(--text-dim); margin-bottom: 8px; display: block; font-weight: 500; }
        .la-textarea {
          width: 100%;
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 10px;
          color: var(--text);
          padding: 12px 14px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          resize: vertical;
          min-height: 90px;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .la-textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(42, 102, 238, 0.1); }
        .la-tones { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 14px 0 20px 0; }
        .la-tone-btn {
          text-align: left;
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 10px 12px;
          cursor: pointer;
          color: var(--text);
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .la-tone-btn:hover { border-color: var(--primary); }
        .la-tone-btn.active { border-color: var(--primary); background: rgba(42,102,238,0.08); }
        .la-tone-btn .t-label { font-size: 13px; font-weight: 600; }
        .la-tone-btn .t-hint { font-size: 11px; color: var(--text-dim); margin-top: 2px; }
        .la-btn-primary {
          background: var(--primary);
          color: #FFFFFF;
          border: none;
          border-radius: 10px;
          padding: 12px 18px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s ease;
        }
        .la-btn-primary:hover { background: var(--primary-hover); }
        .la-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .la-btn-secondary {
          background: transparent;
          color: var(--text);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 12px 16px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .la-btn-secondary:hover { border-color: var(--primary); background: var(--panel); }
        .la-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
 
        .la-card { background: #FFFFFF; color: #1A1A1A; border-radius: 12px; padding: 16px; font-family: 'Inter', sans-serif; border: 1px solid var(--line); box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.05); }
        .la-card-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .la-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-soft));
          color: #FFFFFF; display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-family: 'Space Grotesk', sans-serif; font-size: 15px;
          flex-shrink: 0;
        }
        .la-card-name { font-weight: 600; font-size: 14px; }
        .la-card-headline { font-size: 12px; color: #5E5E66; }
        .la-card-time { font-size: 11px; color: #8A8A92; }
        .la-card-body { font-size: 14px; line-height: 1.55; white-space: pre-wrap; margin: 4px 0 10px 0; }
        .la-card-body b { color: #14100A; }
        .la-hashtags { color: #0A66C2; font-size: 13px; margin-bottom: 12px; }
        .la-card-bar {
          display: flex; gap: 22px; padding-top: 10px;
          border-top: 1px solid #E8E8EA;
          font-size: 12px; color: #6B6B72;
        }
 
        .la-charcount { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-dim); margin-top: 10px; }
        .la-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.35);
          color: #EF4444;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13px;
          margin-top: 14px;
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
        }
        .la-loading { display: flex; align-items: center; gap: 10px; color: var(--text-dim); font-size: 14px; padding: 30px 0; justify-content: center; }
        .spin { animation: la-spin 0.9s linear infinite; }
        @keyframes la-spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
 
        .la-panel-note { font-size: 12px; color: var(--text-dim); margin-top: 16px; line-height: 1.5; }
        .la-back {
          background: none; border: none; color: var(--text-dim); cursor: pointer;
          display: flex; align-items: center; gap: 6px; font-size: 12px; margin-bottom: 14px;
        }
        .la-back:hover { color: var(--text); }
      `}</style>

      {stage === "compose" && (
        <>
          <div className="la-eyebrow">Compose</div>
          <h2 className="la-title">What's the post about?</h2>
          <label className="la-label">Topic or what happened</label>
          <textarea
            className="la-textarea"
            placeholder="e.g. I just shipped a feature and learned something about React re-renders the hard way."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <div style={{ marginTop: 18 }}>
            <label className="la-label">Angle</label>
            <div className="la-tones">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  className={"la-tone-btn" + (tone === t.id ? " active" : "")}
                  onClick={() => setTone(t.id)}
                >
                  <div className="t-label">{t.label}</div>
                  <div className="t-hint">{t.hint}</div>
                </button>
              ))}
            </div>
          </div>
          <button className="la-btn-primary" onClick={handleGenerateFirst} disabled={!topic.trim()}>
            <Sparkles size={16} /> Generate draft
          </button>
        </>
      )}

      {stage === "loading" && (
        <div className="la-loading">
          <Loader2 size={18} className="spin" /> Drafting your post…
        </div>
      )}

      {(stage === "preview" || stage === "preview_error") && post && (
        <>
          <button className="la-back" onClick={resetAll}><ArrowLeft size={14} /> Start over</button>
          <div className="la-eyebrow">Preview</div>
          <h2 className="la-title">This is what goes out</h2>

          <div className="la-card">
            <div className="la-card-head">
              <div className="la-avatar">YN</div>
              <div>
                <div className="la-card-name">Your Name</div>
                <div className="la-card-headline">Your headline goes here</div>
                <div className="la-card-time">Now · 🌐</div>
              </div>
            </div>
            <div
              className="la-card-body"
              dangerouslySetInnerHTML={{ __html: post.post.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") }}
            />
            {post.hashtags?.length > 0 && <div className="la-hashtags">{post.hashtags.join("  ")}</div>}
            <div className="la-card-bar">
              <span>👍 Like</span><span>💬 Comment</span><span>🔁 Repost</span><span>✈️ Send</span>
            </div>
          </div>
          <div className="la-charcount">{charCount} / 3000 characters</div>

          {mode === "edit" ? (
            <div style={{ marginTop: 16 }}>
              <label className="la-label">What should change?</label>
              <textarea
                ref={textareaRef}
                className="la-textarea"
                placeholder="e.g. make it shorter, punchier hook, remove the third paragraph…"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <div className="la-actions">
                <button className="la-btn-primary" onClick={handleEditSubmit} disabled={!feedback.trim()}>
                  <Check size={16} /> Apply changes
                </button>
                <button className="la-btn-secondary" onClick={() => setMode(null)}>
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="la-actions">
              <button className="la-btn-primary" onClick={handleApprove}>
                <Check size={16} /> Approve to publish
              </button>
              <button className="la-btn-secondary" onClick={() => setMode("edit")}>
                <Pencil size={16} /> Edit draft
              </button>
              <button className="la-btn-secondary" onClick={handleRegenerate}>
                <RefreshCw size={16} /> Try a new angle
              </button>
            </div>
          )}

          {stage === "preview_error" && error && (
            <div className="la-error">
              <span>{error}</span>
              <button className="la-btn-secondary" style={{ padding: "6px 10px" }} onClick={() => setStage("preview")}>
                Dismiss
              </button>
            </div>
          )}
        </>
      )}

      {stage === "approved" && post && (
        <>
          <div className="la-eyebrow">Approved</div>
          <h2 className="la-title">Ready to go out</h2>
          <div className="la-card">
            <div className="la-card-head">
              <div className="la-avatar">YN</div>
              <div>
                <div className="la-card-name">Your Name</div>
                <div className="la-card-headline">Your headline goes here</div>
                <div className="la-card-time">Now · 🌐</div>
              </div>
            </div>
            <div
              className="la-card-body"
              dangerouslySetInnerHTML={{ __html: post.post.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") }}
            />
            {post.hashtags?.length > 0 && <div className="la-hashtags">{post.hashtags.join("  ")}</div>}
          </div>
          <div className="la-actions">
            <button className="la-btn-primary" onClick={handleCopy}>
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy post text"}
            </button>
            <button className="la-btn-secondary" onClick={resetAll}>
              <Send size={16} /> Start a new post
            </button>
          </div>
          <div className="la-panel-note">
            This copies the final text — pasting into LinkedIn is a manual step. True one-click publishing would need
            LinkedIn's own Share API with an approved OAuth app, which is a separate registration process on LinkedIn's side.
          </div>
        </>
      )}
    </div>
  );
}