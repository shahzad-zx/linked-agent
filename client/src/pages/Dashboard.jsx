// import React from "react";
// import { LogOut } from "lucide-react";
// import { useAuth } from "../context/AuthContext.jsx";
// import LinkedAgent from "../components/LinkedAgent.jsx";

// export default function Dashboard() {
//   const { user, logout } = useAuth();

//   return (
//     <div style={{ minHeight: "100vh" }}>
//       <header style={{
//         borderBottom: "1px solid var(--line)",
//         padding: "16px 24px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <div style={{
//             width: 30, height: 30, borderRadius: 8,
//             background: "linear-gradient(135deg, var(--primary), var(--primary-soft))",
//           }} />
//           <span style={{ fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>LinkedAgent</span>
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
//           <span style={{ fontSize: 13, color: "var(--text-dim)" }}>{user?.email}</span>
//           <button className="btn-secondary" onClick={logout} style={{ padding: "8px 14px" }}>
//             <LogOut size={14} /> Log out
//           </button>
//         </div>
//       </header>

//       <main style={{ padding: "40px 24px" }}>
//         <div className="container" style={{ maxWidth: 720, padding: 0 }}>
//           <LinkedAgent />
//         </div>
//       </main>
//     </div>
//   );
// }


// next

import React, { useState } from "react";
import { LogOut, PenSquare, LayoutTemplate } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import LinkedAgent from "../components/LinkedAgent.jsx";
import VisualGenerator from "../components/VisualGenerator.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState("post"); // "post" | "visual"

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
            background: "linear-gradient(135deg, var(--amber), var(--amber-soft))",
          }} />
          <a href='/' style={{ fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }} >LinkedAgent</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 13, color: "var(--ink-dim)" }}>{user?.email}</span>
          <button className="btn-secondary" onClick={logout} style={{ padding: "8px 14px" }}>
            <LogOut size={14} /> Log out
          </button>
        </div>
      </header>

      <main style={{ padding: "40px 24px" }}>
        <div className="container" style={{ maxWidth: 720, padding: 0 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
            <button
              onClick={() => setSection("post")}
              className={section === "post" ? "btn-primary" : "btn-secondary"}
            >
              <PenSquare size={15} /> Post draft
            </button>
            <button
              onClick={() => setSection("visual")}
              className={section === "visual" ? "btn-primary" : "btn-secondary"}
            >
              <LayoutTemplate size={15} /> Flowchart / Table
            </button>
          </div>

          {section === "post" ? <LinkedAgent /> : <VisualGenerator />}
        </div>
      </main>
    </div>
  );
}