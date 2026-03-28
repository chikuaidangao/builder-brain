const difficultyColor = {
  easy: { bg: "#e6f4ea", text: "#2d6a4f" },
  medium: { bg: "#fff8e1", text: "#b45309" },
  hard: { bg: "#fdecea", text: "#9b2226" },
};
const difficultyLabel = { easy: "简单", medium: "中等", hard: "困难" };

export default function IdeaCard({ idea, favorites, onFavChange }) {
  const isFavorited = favorites.some((f) => f.title === idea.title);

  function toggleFavorite() {
    onFavChange(idea);
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
        <button onClick={toggleFavorite} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22 }}>
          {isFavorited ? "❤️" : "🤍"}
        </button>
      </div>
      <p style={{ color: "#444", lineHeight: 1.6, marginBottom: 12 }}>{idea.description}</p>
      <p style={{ color: "#888", fontSize: 14 }}>
        <span style={{ fontWeight: 600, color: "#555" }}>变现方式：</span>{idea.monetization}
      </p>
    </div>
  );
}
