import { useState } from "react";

export default function Home() {
  const [keywords, setKeywords] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!keywords.trim()) return;
    setLoading(true);
    setError("");
    setIdeas([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "请求失败");
      setIdeas(data.ideas);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const difficultyColor = {
    easy: { bg: "#e6f4ea", text: "#2d6a4f" },
    medium: { bg: "#fff8e1", text: "#b45309" },
    hard: { bg: "#fdecea", text: "#9b2226" },
  };

  const difficultyLabel = {
    easy: "简单",
    medium: "中等",
    hard: "困难",
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Builder Brain</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>输入关键词，生成 5 个产品创意</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
        <input
          type="text"
          placeholder="例：AI + 健身 + 订阅"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          style={{
            flex: 1,
            padding: "12px 16px",
            fontSize: 16,
            border: "1px solid #ddd",
            borderRadius: 8,
            outline: "none",
          }}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !keywords.trim()}
          style={{
            padding: "12px 24px",
            fontSize: 16,
            fontWeight: 600,
            background: loading ? "#ccc" : "#1a1a1a",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "生成中..." : "生成创意"}
        </button>
      </div>

      {error && (
        <p style={{ color: "#9b2226", background: "#fdecea", padding: "12px 16px", borderRadius: 8, marginBottom: 24 }}>
          {error}
        </p>
      )}

      {ideas.length > 0 && (
        <div style={{ display: "grid", gap: 16 }}>
          {ideas.map((idea, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: 12,
                padding: 24,
                background: "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 18 }}>{idea.title}</span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 20,
                    background: difficultyColor[idea.difficulty]?.bg,
                    color: difficultyColor[idea.difficulty]?.text,
                  }}
                >
                  {difficultyLabel[idea.difficulty] ?? idea.difficulty}
                </span>
              </div>
              <p style={{ color: "#444", lineHeight: 1.6, marginBottom: 12 }}>{idea.description}</p>
              <p style={{ color: "#888", fontSize: 14 }}>
                <span style={{ fontWeight: 600, color: "#555" }}>变现方式：</span>
                {idea.monetization}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
