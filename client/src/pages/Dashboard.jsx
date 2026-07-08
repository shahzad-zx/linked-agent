import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import LinkedAgent from "../components/LinkedAgent.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{
        borderBottom: "1px solid var(--line)",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg, var(--primary), var(--primary-soft))",
          }} />
          <span style={{ fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>LinkedAgent</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: "var(--text-dim)" }}>{user?.email}</span>
          <button className="btn-secondary" onClick={logout} style={{ padding: "8px 14px" }}>
            <LogOut size={14} /> Log out
          </button>
        </div>
      </header>

      <main style={{ padding: "40px 24px" }}>
        <div className="container" style={{ maxWidth: 720, padding: 0 }}>
          <LinkedAgent />
        </div>
      </main>
    </div>
  );
}