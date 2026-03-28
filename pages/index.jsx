import { useState, useEffect } from "react";
import IdeaCard from "../components/IdeaCard";

function btnStyle(bg, color) {
  return { padding: "10px 20px", fontSize: 14, fontWeight: 600, background: bg, color, border: "none", borderRadius: 8, cursor: "pointer" };
}

export default function Home() {
  const [keywords, setKeywords] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState("home");

  // 从本地存储加载收藏
  useEffect(() => {
    const savedFavorites = localStorage.getItem("builder-brain-favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // 保存收藏到本地存储
  useEffect(() => {
    localStorage.setItem("builder-brain-favorites", JSON.stringify(favorites));
  }, [favorites]);

  async function handleGenerate() {
    if (!keywords.trim()) return;
    setLoading(true); setError(""); setIdeas([]);
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

  function toggleFavorite(idea) {
    setFavorites(prev => {
      const isFavorited = prev.some(f => f.title === idea.title);
      if (isFavorited) {
        return prev.filter(f => f.title !== idea.title);
      } else {
        return [...prev, idea];
      }
    });
  }

  const cardList = view === "profile" ? favorites : ideas;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, cursor: "pointer" }} onClick={() => setView("home")}>Builder Brain</h1>
          <p style={{ color: "#666", margin: "4px 0 0" }}>输入关键词，生成 5 个产品创意</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setView("profile")} style={btnStyle("#f5f5f5", "#333")}>我的收藏</button>
        </div>
      </div>

      {view === "home" && (
        <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
          <input
            type="text" placeholder="例：AI + 健身 + 订阅" value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            style={{ flex: 1, padding: "12px 16px", fontSize: 16, border: "1px solid #ddd", borderRadius: 8, outline: "none" }}
          />
          <button onClick={handleGenerate} disabled={loading || !keywords.trim()} style={btnStyle(loading ? "#ccc" : "#1a1a1a", "#fff")}>
            {loading ? "生成中..." : "生成创意"}
          </button>
        </div>
      )}

      {view === "profile" && <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>我的收藏 ({favorites.length})</h2>}

      {error && <p style={{ color: "#9b2226", background: "#fdecea", padding: "12px 16px", borderRadius: 8, marginBottom: 24 }}>{error}</p>}

      {cardList.length > 0 && (
        <div style={{ display: "grid", gap: 16 }}>
          {cardList.map((idea, i) => (
            <IdeaCard key={i} idea={idea} favorites={favorites} onFavChange={toggleFavorite} />
          ))}
        </div>
      )}

      {view === "profile" && favorites.length === 0 && (
        <p style={{ color: "#999", textAlign: "center", marginTop: 60 }}>还没有收藏，去生成一些创意吧</p>
      )}
    </div>
  );
}
