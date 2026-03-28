import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import IdeaCard from "../components/IdeaCard";

function btnStyle(bg, color) {
  return { padding: "10px 20px", fontSize: 14, fontWeight: 600, background: bg, color, border: "none", borderRadius: 8, cursor: "pointer" };
}

export default function Home() {
  const [keywords, setKeywords] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState("home");

  // 从本地存储加载收藏（未登录时使用）
  useEffect(() => {
    if (!user) {
      const savedFavorites = localStorage.getItem("builder-brain-favorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, [user]);

  // 保存收藏到本地存储（未登录时使用）
  useEffect(() => {
    if (!user) {
      localStorage.setItem("builder-brain-favorites", JSON.stringify(favorites));
    }
  }, [favorites, user]);

  // Supabase 认证
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  // 登录后从 Supabase 加载收藏
  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  async function fetchFavorites() {
    try {
      const { data } = await supabase.from("favorites").select("*").order("created_at", { ascending: false });
      setFavorites(data || []);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      // 失败时使用本地存储
      const savedFavorites = localStorage.getItem("builder-brain-favorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }

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

  async function toggleFavorite(idea) {
    if (user) {
      // 登录状态：使用 Supabase
      try {
        const isFavorited = favorites.some(f => f.title === idea.title);
        if (isFavorited) {
          const target = favorites.find(f => f.title === idea.title);
          await supabase.from("favorites").delete().eq("id", target.id);
        } else {
          await supabase.from("favorites").insert({
            user_id: user.id,
            title: idea.title,
            description: idea.description,
            difficulty: idea.difficulty,
            monetization: idea.monetization,
          });
        }
        await fetchFavorites();
      } catch (err) {
        console.error("Failed to toggle favorite:", err);
        // 失败时回退到本地存储
        toggleLocalFavorite(idea);
      }
    } else {
      // 未登录状态：使用本地存储
      toggleLocalFavorite(idea);
    }
  }

  function toggleLocalFavorite(idea) {
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
          {user ? (
            <button onClick={() => { supabase.auth.signOut(); setFavorites([]); setView("home"); }} style={btnStyle("#f5f5f5", "#333")}>退出</button>
          ) : (
            <button onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })} style={btnStyle("#1a1a1a", "#fff")}>Google 登录</button>
          )}
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
