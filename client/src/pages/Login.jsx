import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, margin: "0 auto 16px",
            background: "linear-gradient(135deg, var(--primary), var(--primary-soft))",
          }} />
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Welcome back</h1>
          <p style={{ color: "var(--text-dim)", fontSize: 14, marginTop: 6 }}>Log in to keep drafting.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field-label">Email</label>
          <input
            className="text-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={{ marginBottom: 16 }}
          />
          <label className="field-label">Password</label>
          <input
            className="text-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ marginBottom: 20 }}
          />
          {error && (
            <div style={{
              background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.35)",
              color: "#FF9C9C", padding: "10px 12px", borderRadius: 8, fontSize: 13, marginBottom: 16,
            }}>
              {error}
            </div>
          )}
          <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
            <LogIn size={16} /> {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-dim)", marginTop: 24 }}>
          Don't have an account? <Link to="/signup" style={{ color: "var(--primary)" }}>Sign up free</Link>
        </p>
      </div>
    </div>
  );
}