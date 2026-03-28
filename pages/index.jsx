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
  const [searches, setSearches] = useState([]);
  const [view, setView] = useState("home");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) { fetchFavorites(); fetchSearches(); }
  }, [user]);

  async function fetchFavorites() {
    const { data } = await supabase.from("favorites").select("*").order("created_at", { ascending: false });
    setFavorites(data || []);
  }

  async function fetchSearches() {
    const { data } = await supabase.from("searches").select("*").order("created_at", { ascending: false }).limit(20);
    setSearches(data || []);
  }

  async function handleGenerate(kw) {
    const query = kw || keywords;
    if (!query.trim()) return;
    setKeywords(query);
    setLoading(true); setError(""); setIdeas([]); setView("home");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "请求失败");
      setIdeas(data.ideas);
      if (user) {
        await supabase.from("searches").insert({ user_id: user.id, keywords: query });
        fetchSearches();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleShare() {
    const url = `${window.location.origin}?keywords=${encodeURIComponent(keywords)}`;
    navigator.clipboard.writeText(url);
    alert("链接已复制，分享给朋友吧！");
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const kw = params.get("keywords");
    if (kw) handleGenerate(kw);
  }, []);

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

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, cursor: "pointer" }} onClick={() => setView("home")}>Builder Brain</h1>
          <p style={{ color: "#666", margin: "4px 0 0" }}>输入关键词，生成 5 个产品创意</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {user ? (
            <>
              <button onClick={() => setView("profile")} style={btnStyle("#f5f5f5", "#333")}>我的收藏</button>
              <button onClick={() => setView("history")} style={btnStyle("#f5f5f5", "#333")}>搜索历史</button>
              <button onClick={() => { supabase.auth.signOut(); setFavorites([]); setSearches([]); setView("home"); }} style={btnStyle("#f5f5f5", "#333")}>退出</button>
            </>
          ) : (
            <button onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })} style={btnStyle("#1a1a1a", "#fff")}>Google 登录</button>
          )}
        </div>
      </div>

      {view === "home" && (
        <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
          <input type="text" placeholder="例：AI + 健身 + 订阅" value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            style={{ flex: 1, padding: "12px 16px", fontSize: 16, border: "1px solid #ddd", borderRadius: 8, outline: "none" }}
          />
          <button onClick={() => handleGenerate()} disabled={loading || !keywords.trim()} style={btnStyle(loading ? "#ccc" : "#1a1a1a", "#fff")}>
            {loading ? "生成中..." : "生成创意"}
          </button>
        </div>
      )}

      {view === "profile" && <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>我的收藏 ({favorites.length})</h2>}

      {view === "history" && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>搜索历史</h2>
          {searches.length === 0 && <p style={{ color: "#999" }}>还没有搜索记录</p>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {searches.map((s) => (
              <button key={s.id} onClick={() => handleGenerate(s.keywords)}
                style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid #ddd", background: "#f5f5f5", cursor: "pointer", fontSize: 14 }}>
                {s.keywords}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p style={{ color: "#9b2226", background: "#fdecea", padding: "12px 16px", borderRadius: 8, marginBottom: 24 }}>{error}</p>}

      {ideas.length > 0 && view === "home" && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button onClick={handleShare} style={btnStyle("#f5f5f5", "#333")}>分享这些创意</button>
          </div>
          <div style={{ display: "grid", gap: 16 }}>
            {ideas.map((idea, i) => (
              <IdeaCard key={i} idea={idea} favorites={favorites} onFavChange={toggleFavorite} />
            ))}
          </div>
        </>
      )}

      {view === "profile" && (
        <div style={{ display: "grid", gap: 16 }}>
          {favorites.length === 0
            ? <p style={{ color: "#999", textAlign: "center", marginTop: 60 }}>还没有收藏，去生成一些创意吧</p>
            : favorites.map((idea, i) => <IdeaCard key={i} idea={idea} favorites={favorites} onFavChange={toggleFavorite} />
          )}
        </div>
      )}
    </div>
  );
}
