import React, { useState, useRef } from "react";
import { GitBranch, Table2, Code, Columns, Route, Check, Sparkles, Download, RefreshCw, Loader2 } from "lucide-react";
import mermaid from "mermaid";
import { toPng } from "html-to-image";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    themeVariables: {
        primaryColor: "#1F1F26",
        primaryTextColor: "#F5F1EA",
        primaryBorderColor: "#FF7A00",
        lineColor: "#FFB347",
        secondaryColor: "#16161B",
        tertiaryColor: "#16161B",
        fontFamily: "Inter, sans-serif",
        background: "#0B0B0E",
        mainBkg: "#1F1F26",
        nodeBorder: "#FF7A00",
        clusterBkg: "#16161B",
        edgeLabelBackground: "#0B0B0E",
    },
});

const VISUAL_TYPES = [
    { id: "flowchart", label: "Flowchart", hint: "Process sequences or flow logic", icon: GitBranch, color: "#F59E0B" },
    { id: "table", label: "Reference Table", hint: "Scannable row and column layout", icon: Table2, color: "#3B82F6" },
    { id: "cheatsheet", label: "Cheatsheet", hint: "Information-dense grid of definitions & code", icon: Code, color: "#10B981" },
    { id: "comparison", label: "Side-by-Side", hint: "Compare 2-3 options, pros & cons", icon: Columns, color: "#8B5CF6" },
    { id: "roadmap", label: "Learning Roadmap", hint: "Step-by-step skill path or milestones", icon: Route, color: "#EC4899" },
];


// comment

// async function callVisualAPI(type, idea) {
//     const response = await fetch(`${API_URL}/api/generate-visual`, {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ type, idea }),
//     });
//     const data = await response.json();
//     if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
//     return data;
// }

async function callVisualAPI(type, idea, visualType = "default") {
    const endpoint = visualType === "visualizelearning"
        ? `${API_URL}/api/generate-visual/visualizelearning`
        : `${API_URL}/api/generate-visual`;

    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, idea }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
    return data;
}

export default function VisualGenerator() {
    const [type, setType] = useState("flowchart");
    const [idea, setIdea] = useState("");
    const [stage, setStage] = useState("compose"); // compose | loading | ready | error
    const [result, setResult] = useState(null); // flowchart | table | cheatsheet | comparison | roadmap
    const [error, setError] = useState("");
    const [svgMarkup, setSvgMarkup] = useState("");
    const [downloading, setDownloading] = useState(false);
    const previewRef = useRef(null);
    const renderCounter = useRef(0);

    const activeTypeObj = VISUAL_TYPES.find((vt) => vt.id === type) || VISUAL_TYPES[0];
    const typeColor = activeTypeObj.color;


    // comment

    // async function generate() {
    //     if (!idea.trim()) return;
    //     setStage("loading");
    //     setError("");
    //     setSvgMarkup("");
    //     try {
    //         const data = await callVisualAPI(type, idea);
    //         setResult(data);

    //         if (type === "flowchart") {
    //             renderCounter.current += 1;
    //             const id = `mermaid-diagram-${renderCounter.current}`;
    //             const { svg } = await mermaid.render(id, data.mermaid);
    //             setSvgMarkup(svg);
    //         }
    //         setStage("ready");
    //     } catch (e) {
    //         setError(e.message || "Something went wrong generating that.");
    //         setStage("error");
    //     }
    // }

    async function generate() {
        if (!idea.trim()) return;
        setStage("loading");
        setError("");
        setSvgMarkup("");
        try {
            // Pass visualizelearning for cheatsheets, default for others
            const visualType = type === "cheatsheet" ? "visualizelearning" : "default";
            const data = await callVisualAPI(type, idea, visualType);
            setResult(data);

            if (type === "flowchart") {
                renderCounter.current += 1;
                const id = `mermaid-diagram-${renderCounter.current}`;
                const { svg } = await mermaid.render(id, data.mermaid);
                setSvgMarkup(svg);
            }
            setStage("ready");
        } catch (e) {
            setError(e.message || "Something went wrong generating that.");
            setStage("error");
        }
    }

    async function handleDownload() {
        if (!previewRef.current) return;
        setDownloading(true);
        try {
            const dataUrl = await toPng(previewRef.current, { pixelRatio: 2, backgroundColor: "#0B0B0E" });
            const link = document.createElement("a");
            link.download = `${(result?.title || type).replace(/\s+/g, "-").toLowerCase()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (e) {
            setError("Couldn't export the image — try again.");
        } finally {
            setDownloading(false);
        }
    }

    function reset() {
        setStage("compose");
        setIdea("");
        setResult(null);
        setSvgMarkup("");
        setError("");
    }

    function highlightCode(code) {
        if (!code) return null;
        const keywords = /\b(const|let|var|function|return|import|export|from|class|default|async|await|true|false|null)\b/g;
        const hooks = /\b(useState|useEffect|useContext|useReducer|useMemo|useCallback|useRef)\b/g;
        let html = code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        html = html.replace(keywords, '<span style="color: #FF7B72;">$1</span>');
        html = html.replace(hooks, '<span style="color: #79C0FF;">$1</span>');
        return <code dangerouslySetInnerHTML={{ __html: html }} />;
    }

    const getPlaceholder = () => {
        switch (type) {
            case "flowchart": return "e.g. how a React component goes through mounting, updating, and unmounting";
            case "table": return "e.g. compare SQL vs NoSQL databases";
            case "cheatsheet": return "e.g. Git commands reference sheet or React hooks overview";
            case "comparison": return "e.g. useState vs useReducer vs Redux";
            case "roadmap": return "e.g. career path for a Python Full Stack Developer";
            default: return "Describe what you want to generate...";
        }
    };

    const getLabel = () => {
        switch (type) {
            case "flowchart": return "Describe the process or steps";
            case "table": return "Describe what to put in columns and rows";
            case "cheatsheet": return "Describe the technical topic for the cheatsheet";
            case "comparison": return "Describe the options to compare side-by-side";
            case "roadmap": return "Describe the skill pathway or roadmap milestones";
            default: return "Describe your idea";
        }
    };

    return (
        <div style={{ maxWidth: 720 }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--amber)", textTransform: "uppercase", marginBottom: 6 }}>
                Visuals
            </div>
            <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 20 }}>Generate visual LinkedIn infographics</h2>

            {stage === "compose" && (
                <>
                    <label className="field-label" style={{ marginBottom: 12 }}>Choose Visual Style</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 20 }}>
                        {VISUAL_TYPES.map((vt) => {
                            const Icon = vt.icon;
                            const isSelected = type === vt.id;
                            return (
                                <button
                                    key={vt.id}
                                    onClick={() => setType(vt.id)}
                                    className="btn-secondary"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        padding: "14px",
                                        textAlign: "left",
                                        height: "auto",
                                        borderColor: isSelected ? vt.color : "var(--line)",
                                        background: isSelected ? `${vt.color}0a` : "var(--panel)",
                                        position: "relative",
                                        transition: "all 0.2s ease",
                                        boxShadow: isSelected ? `0 0 0 2px ${vt.color}25` : "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                        <span style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 28,
                                            height: 28,
                                            borderRadius: 6,
                                            background: `${vt.color}15`,
                                            color: vt.color,
                                        }}>
                                            <Icon size={16} />
                                        </span>
                                        <span style={{ fontWeight: 600, fontSize: 13, color: isSelected ? "var(--text)" : "var(--text-dim)" }}>
                                            {vt.label}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: 11, color: "var(--ink-dim)", lineHeight: 1.4 }}>
                                        {vt.hint}
                                    </span>
                                    {isSelected && (
                                        <div style={{
                                            position: "absolute",
                                            top: 12,
                                            right: 12,
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            background: vt.color,
                                        }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <label className="field-label">{getLabel()}</label>
                    <textarea
                        className="text-input"
                        style={{ minHeight: 90, resize: "vertical" }}
                        placeholder={getPlaceholder()}
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                    />
                    <button className="btn-primary" style={{ marginTop: 16 }} onClick={generate} disabled={!idea.trim()}>
                        <Sparkles size={16} /> Generate {activeTypeObj.label}
                    </button>
                </>
            )}

            {stage === "loading" && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--ink-dim)", padding: "30px 0", justifyContent: "center" }}>
                    <Loader2 size={18} className="spin-icon" /> Designing your {activeTypeObj.label.toLowerCase()}…
                </div>
            )}

            {stage === "error" && (
                <div style={{
                    background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.35)",
                    color: "#FF9C9C", padding: "12px 14px", borderRadius: 8, fontSize: 13, marginBottom: 14,
                }}>
                    {error}
                    <div style={{ marginTop: 10 }}>
                        <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={reset}>Start over</button>
                    </div>
                </div>
            )}

            {stage === "ready" && result && (
                <>
                    <div
                        ref={previewRef}
                        style={{
                            background: "#0B0B0E",
                            border: "1px solid #262635",
                            borderRadius: 14,
                            padding: 28,
                            color: "#FFFFFF",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        {/* Infographic Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #262635", paddingBottom: 16, marginBottom: 20 }}>
                            <div style={{ flex: 1, marginRight: 16 }}>
                                <h3 style={{ fontSize: type === "cheatsheet" ? 26 : 20, fontWeight: 800, color: "#FFFFFF", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em", margin: 0, textTransform: type === "cheatsheet" ? "uppercase" : "none", lineHeight: 1.2 }}>
                                    {result.title}
                                </h3>
                                {result.subtitle && (
                                    <p style={{ fontSize: 12, color: "#A0AEC0", margin: "6px 0 0 0", fontFamily: "'Inter', sans-serif", maxWidth: "90%", lineHeight: 1.5 }}>
                                        {result.subtitle}
                                    </p>
                                )}
                            </div>
                            {type === "cheatsheet" && result.pills ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 260, background: "rgba(255, 255, 255, 0.02)", padding: 12, borderRadius: 8, border: "1px solid #262635" }}>
                                    {result.pills.map((pill, idx) => (
                                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
                                            <span style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: 18,
                                                height: 18,
                                                borderRadius: 4,
                                                background: pill.color || typeColor,
                                                color: "#000000",
                                                fontWeight: 800,
                                                fontSize: 9,
                                                textTransform: "uppercase"
                                            }}>
                                                {pill.label ? pill.label[0] : "•"}
                                            </span>
                                            <span style={{ fontWeight: 700, color: "#FFFFFF" }}>{pill.label}</span>
                                            <span style={{ color: "#718096" }}>→</span>
                                            <span style={{ color: "#A0AEC0" }}>{pill.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    background: "rgba(255, 255, 255, 0.04)",
                                    padding: "6px 12px",
                                    borderRadius: 8,
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                }}>
                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: typeColor }} />
                                    <span style={{ fontSize: 10, fontWeight: 700, color: "#E2E8F0", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "'JetBrains Mono', monospace" }}>
                                        {type}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Infographic Content Renderers */}
                        {type === "flowchart" && (
                            <div
                                style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px 0", background: "rgba(0,0,0,0.2)", borderRadius: 10 }}
                                dangerouslySetInnerHTML={{ __html: svgMarkup }}
                            />
                        )}

                        {type === "table" && (
                            <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #262635", background: "#111116" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", color: "#F5F1EA" }}>
                                    <thead>
                                        <tr style={{ background: `linear-gradient(135deg, ${typeColor}BB, ${typeColor}77)` }}>
                                            {result.columns?.map((col, idx) => (
                                                <th key={idx} style={{
                                                    textAlign: "left",
                                                    padding: "12px 16px",
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    color: "#FFFFFF",
                                                    borderBottom: "2px solid rgba(0,0,0,0.15)",
                                                }}>{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.rows?.map((row, i) => (
                                            <tr key={i} style={{
                                                background: i % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.02)",
                                            }}>
                                                {row.map((cell, j) => (
                                                    <td key={j} style={{
                                                        padding: "12px 16px",
                                                        fontSize: 12,
                                                        lineHeight: 1.5,
                                                        borderBottom: "1px solid #262635",
                                                        color: "#E2E8F0",
                                                    }}>
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {type === "cheatsheet" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
                                {/* Flow / How it works */}
                                {result.flow && (
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                                            <div style={{ flex: 1, height: 1, background: "#262635" }} />
                                            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#718096", textTransform: "uppercase" }}>How It Works</span>
                                            <div style={{ flex: 1, height: 1, background: "#262635" }} />
                                        </div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                                            {result.flow.map((item, idx) => (
                                                <div key={idx} style={{
                                                    flex: 1,
                                                    minWidth: 160,
                                                    background: "#121217",
                                                    border: "1px solid #262635",
                                                    borderTop: `3px solid ${idx === 0 ? "#8B5CF6" : idx === 1 ? "#F59E0B" : idx === 2 ? "#10B981" : "#3B82F6"}`,
                                                    borderRadius: 8,
                                                    padding: "14px 16px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 6,
                                                    position: "relative"
                                                }}>
                                                    <span style={{ fontSize: 10, fontWeight: 800, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                                                        {item.step}. {item.name}
                                                    </span>
                                                    <span style={{ fontSize: 11, color: "#A0AEC0", lineHeight: 1.4 }}>
                                                        {item.desc}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Folder Structure & Code Implementation */}
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, marginBottom: 8 }}>
                                    <div style={{ flex: 1, height: 1, background: "#262635" }} />
                                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#718096", textTransform: "uppercase" }}>Folder Structure & Code Example</span>
                                    <div style={{ flex: 1, height: 1, background: "#262635" }} />
                                </div>

                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 2fr",
                                    gap: 20,
                                    width: "100%"
                                }}>
                                    {/* Left Column: Terminal Folder Structure */}
                                    {result.folder_structure && (
                                        <div style={{
                                            background: "#08080C",
                                            border: "1px solid #232330",
                                            borderRadius: 10,
                                            overflow: "hidden",
                                            display: "flex",
                                            flexDirection: "column"
                                        }}>
                                            {/* Terminal window controls header */}
                                            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderBottom: "1px solid #1A1A26", background: "#0D0D14" }}>
                                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF5F56" }} />
                                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFBD2E" }} />
                                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#27C93F" }} />
                                                <span style={{ fontSize: 10, color: "#718096", marginLeft: 6, fontFamily: "'JetBrains Mono', monospace" }}>project-layout</span>
                                            </div>
                                            <pre style={{
                                                margin: 0,
                                                padding: 16,
                                                fontSize: 11,
                                                fontFamily: "'JetBrains Mono', monospace",
                                                color: "#A0AEC0",
                                                lineHeight: 1.5,
                                                overflowX: "auto"
                                            }}>
                                                {result.folder_structure}
                                            </pre>
                                        </div>
                                    )}

                                    {/* Right Column: Code Files */}
                                    {result.files && (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                            {result.files.map((fileObj, idx) => (
                                                <div key={idx} style={{
                                                    background: "#121217",
                                                    border: "1px solid #262635",
                                                    borderRadius: 8,
                                                    overflow: "hidden",
                                                    display: "grid",
                                                    gridTemplateColumns: "1fr 2fr",
                                                    minHeight: 120
                                                }}>
                                                    {/* File Info Card */}
                                                    <div style={{
                                                        padding: 14,
                                                        borderRight: "1px solid #262635",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 6,
                                                        background: "rgba(255, 255, 255, 0.01)"
                                                    }}>
                                                        <span style={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF", wordBreak: "break-all" }}>
                                                            {fileObj.file}
                                                        </span>
                                                        <span style={{ fontSize: 10, color: "#718096", textTransform: "uppercase", fontWeight: 700 }}>
                                                            {fileObj.name}
                                                        </span>
                                                        <span style={{ fontSize: 10, color: "#CBD5E0", lineHeight: 1.4 }}>
                                                            {fileObj.desc}
                                                        </span>
                                                    </div>
                                                    {/* File Code Block */}
                                                    <pre style={{
                                                        margin: 0,
                                                        padding: 14,
                                                        background: "#08080C",
                                                        fontSize: 10,
                                                        fontFamily: "'JetBrains Mono', monospace",
                                                        lineHeight: 1.4,
                                                        overflowX: "auto",
                                                        display: "flex",
                                                        alignItems: "center"
                                                    }}>
                                                        <div style={{ width: "100%" }}>
                                                            {highlightCode(fileObj.code)}
                                                        </div>
                                                    </pre>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Key Takeaway Footer */}
                                {result.takeaway && (
                                    <div style={{
                                        background: "rgba(16, 185, 129, 0.04)",
                                        border: "1px solid rgba(16, 185, 129, 0.15)",
                                        borderRadius: 8,
                                        padding: "12px 16px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        marginTop: 8
                                    }}>
                                        <span style={{ fontSize: 16 }}>💡</span>
                                        <span style={{ fontSize: 11, color: "#CBD5E0", lineHeight: 1.4 }}>
                                            <strong style={{ color: "#10B981" }}>KEY TAKEAWAY: </strong>
                                            {result.takeaway}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {type === "comparison" && (
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: result.options?.length === 3 ? "1fr 1fr 1fr" : "1fr 1fr",
                                gap: 16,
                                width: "100%"
                            }}>
                                {result.options?.map((opt, i) => {
                                    const accentColor = i === 0 ? "#3B82F6" : i === 1 ? "#8B5CF6" : "#EC4899";
                                    return (
                                        <div key={i} style={{
                                            background: "#121217",
                                            border: `1px solid ${accentColor}33`,
                                            borderTop: `4px solid ${accentColor}`,
                                            borderRadius: 8,
                                            padding: 16,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 14,
                                            position: "relative",
                                        }}>
                                            <div>
                                                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                                                    {opt.name}
                                                </h4>
                                                {opt.badge && (
                                                    <span style={{
                                                        display: "inline-block",
                                                        fontSize: 9,
                                                        fontWeight: 700,
                                                        color: accentColor,
                                                        background: `${accentColor}15`,
                                                        padding: "2px 6px",
                                                        borderRadius: 20,
                                                        marginTop: 6,
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.02em",
                                                    }}>
                                                        {opt.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                                                {opt.points?.map((pt, j) => (
                                                    <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 11, lineHeight: 1.5, color: "#E2E8F0" }}>
                                                        <span style={{ color: accentColor, marginTop: 2, display: "inline-flex", flexShrink: 0 }}>
                                                            <Check size={12} strokeWidth={3} />
                                                        </span>
                                                        <span>{pt}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {type === "roadmap" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", position: "relative", paddingLeft: 8 }}>
                                <div style={{
                                    position: "absolute",
                                    left: 19,
                                    top: 15,
                                    bottom: 15,
                                    width: 2,
                                    background: `linear-gradient(to bottom, ${typeColor}, #8B5CF6, #EC4899)`,
                                    zIndex: 0
                                }} />

                                {result.steps?.map((step, i) => (
                                    <div key={i} style={{ display: "flex", gap: 14, zIndex: 1, position: "relative" }}>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 24,
                                            height: 24,
                                            borderRadius: "50%",
                                            background: "#0B0B0E",
                                            border: `3px solid ${typeColor}`,
                                            color: "#FFFFFF",
                                            fontSize: 10,
                                            fontWeight: 800,
                                            boxShadow: `0 0 10px ${typeColor}40`,
                                            marginTop: 4,
                                            flexShrink: 0
                                        }}>
                                            {step.step || (i + 1)}
                                        </div>

                                        <div style={{
                                            flex: 1,
                                            background: "#121217",
                                            border: "1px solid #262635",
                                            borderRadius: 8,
                                            padding: 14,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 8
                                        }}>
                                            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                                                {step.title}
                                            </h4>
                                            {step.goal && (
                                                <div style={{
                                                    fontSize: 11,
                                                    color: "#CBD5E0",
                                                    background: "#08080C",
                                                    padding: "6px 10px",
                                                    borderRadius: 6,
                                                    borderLeft: `2.5px solid ${typeColor}`,
                                                    lineHeight: 1.4
                                                }}>
                                                    <span style={{ fontWeight: 700, color: typeColor, fontSize: 9, display: "block", textTransform: "uppercase", marginBottom: 2 }}>Goal</span>
                                                    {step.goal}
                                                </div>
                                            )}
                                            {step.skills?.length > 0 && (
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 2 }}>
                                                    {step.skills.map((skill, k) => (
                                                        <span key={k} style={{
                                                            fontSize: 10,
                                                            color: "#E2E8F0",
                                                            background: "rgba(255,255,255,0.04)",
                                                            padding: "2px 6px",
                                                            borderRadius: 4,
                                                            border: "1px solid rgba(255,255,255,0.06)"
                                                        }}>
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Infographic Footer / Watermark */}
                        <div style={{ borderTop: "1px solid #262635", paddingTop: 16, marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <div style={{
                                    width: 14, height: 14, borderRadius: 4,
                                    background: `linear-gradient(135deg, ${typeColor}, #FFFFFF)`,
                                }} />
                                <span style={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Space Grotesk', sans-serif" }}>
                                    LinkedAgent
                                </span>
                            </div>
                            <span style={{ fontSize: 9, color: "#718096", fontFamily: "'Inter', sans-serif" }}>
                                Visual Infographic Assistant
                            </span>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
                        <button className="btn-primary" onClick={handleDownload} disabled={downloading}>
                            <Download size={16} /> {downloading ? "Exporting…" : "Download PNG"}
                        </button>
                        <button className="btn-secondary" onClick={generate}>
                            <RefreshCw size={16} /> Regenerate
                        </button>
                        <button className="btn-secondary" onClick={reset}>
                            Start over
                        </button>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--ink-dim)", marginTop: 14, lineHeight: 1.5 }}>
                        Download the PNG, then attach it to your LinkedIn post like any other image — posting the image itself still
                        happens on LinkedIn's side.
                    </p>
                </>
            )}

            <style>{`
        .spin-icon { animation: spin-visual 0.9s linear infinite; }
        @keyframes spin-visual { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}