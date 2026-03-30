import { supabase } from "../lib/supabase";

const difficultyColor = {
  easy: { bg: "#e6f4ea", text: "#2d6a4f" },
  medium: { bg: "#fff8e1", text: "#b45309" },
  hard: { bg: "#fdecea", text: "#9b2226" },
};
const difficultyLabel = { easy: "简单", medium: "中等", hard: "困难" };

export default function IdeaCard({ idea, user, favorites, onFavChange }) {
  const isFavorited = favorites.some((f) => f.title === idea.title);

  async function toggleFavorite() {
    if (!user) { alert("请先登录才能收藏"); return; }
    if (isFavorited) {
      const target = favorites.find((f) => f.title === idea.title);
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
    onFavChange();
  }

  return (
    <div style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 24, background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>{idea.title}</span>
          <span style={{
            fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
            background: difficultyColor[idea.difficulty]?.bg,
            color: difficultyColor[idea.difficulty]?.text,
          }}>
            {difficultyLabel[idea.difficulty] ?? idea.difficulty}
          </span>
        </div>
        {user && (
          <button onClick={toggleFavorite} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22 }}>
            {isFavorited ? "❤️" : "🤍"}
          </button>
        )}
      </div>

      <p style={{ color: "#444", lineHeight: 1.6, marginBottom: 16 }}>{idea.description}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        {
          [
            { label: "目标用户", value: idea.targetUser },
            { label: "核心痛点", value: idea.painPoint },
          ].map(({ label, value }) => value && (
            <div key={label} style={{ background: "#f9f9f9", borderRadius: 8, padding: "10px 12px" }}>
              <p style={{ fontSize: 11, color: "#999", margin: "0 0 4px", fontWeight: 600 }}>{label}</p>
              <p style={{ fontSize: 13, color: "#444", margin: 0, lineHeight: 1.5 }}>{value}</p>
            </div>
          ))
        }
      </div>

      {idea.mvpPlan && (
        <div style={{ background: "#f0f0ff", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
          <p style={{ fontSize: 11, color: "#534AB7", margin: "0 0 4px", fontWeight: 600 }}>MVP 做法</p>
          <p style={{ fontSize: 13, color: "#444", margin: 0, lineHeight: 1.5 }}>{idea.mvpPlan}</p>
        </div>
      )}

      <p style={{ color: "#888", fontSize: 13, margin: 0 }}>
        <span style={{ fontWeight: 600, color: "#555" }}>变现方式：</span>{idea.monetization}
      </p>
    </div>
  );
}