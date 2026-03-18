import React from 'react';
import { getPoster } from '../../utils/helpers';

export const MobileDrawer = ({
  open, onClose, genres, years, movies, switchTab,
  selectedGenre, setSelectedGenre, selectedYear, setSelectedYear,
  selectedRating, setSelectedRating, onMovieClick
}) => {
  if (!open) return null;

  const Item = ({ label, active, onClick }) => (
    <div onClick={onClick} style={{
      padding: "9px 14px", borderRadius: 7, cursor: "pointer", marginBottom: 2,
      background: active ? "#F5C51815" : "transparent",
      borderLeft: active ? "2px solid #F5C518" : "2px solid transparent",
      color: active ? "#F5C518" : "#999", fontSize: 12, fontFamily: "'Space Mono',monospace"
    }}>
      {label}
    </div>
  );

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1500, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "80%", maxWidth: 300,
        background: "#0a0a0a", borderRight: "1px solid #1e1e1e",
        display: "flex", flexDirection: "column", animation: "slideRight 0.25s ease"
      }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 22, height: 22, background: "#F5C518", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>🎬</div>
            <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 17, letterSpacing: 2 }}>CINE<span style={{ color: "#F5C518" }}>CRITIC</span></span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "1px solid #2a2a2a", color: "#666", cursor: "pointer", borderRadius: "50%", width: 28, height: 28, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        <div style={{ overflowY: "auto", flex: 1 }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #111" }}>
            <p style={{ color: "#F5C518", fontSize: 8, letterSpacing: 2, fontFamily: "'Anton',sans-serif", marginBottom: 10 }}>NAVIGATE</p>
            {[
              { icon: "🏠", label: "Home", tab: "/" },
              { icon: "⭐", label: "Top Rated", tab: "/top-rated" },
              { icon: "🆕", label: "New Releases", tab: "/new-releases" },
            ].map(({ icon, label, tab }) => (
              <div key={tab} onClick={() => { switchTab(tab); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 3, background: "transparent", borderLeft: "2px solid transparent", transition: "all 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#141414"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ color: "#ccc", fontSize: 13, fontFamily: "'Space Mono',monospace" }}>{label}</span>
              </div>
            ))}
            <div style={{ height: 1, background: "#1a1a1a", margin: "8px 0" }} />
            <p style={{ color: "#333", fontSize: 7, letterSpacing: 2, fontFamily: "'Space Mono',monospace", margin: "10px 0 8px" }}>EXPLORE</p>
            {[
              { icon: "🏆", label: "Top 250 Movies", tab: "/top250", color: "#F5C518" },
              { icon: "🌟", label: "Most Popular", tab: "/most-popular", color: "#a78bfa" },
              { icon: "📅", label: "Release Calendar", tab: "/release-calendar", color: "#4caf50" },
            ].map(({ icon, label, tab, color }) => (
              <div key={tab} onClick={() => { switchTab(tab); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 3, transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#141414"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ color, fontSize: 13, fontFamily: "'Space Mono',monospace" }}>{label}</span>
                <span style={{ marginLeft: "auto", background: `${color}20`, border: `1px solid ${color}40`, color, fontSize: 7, borderRadius: 4, padding: "2px 6px", fontFamily: "'Space Mono',monospace" }}>PAGE</span>
              </div>
            ))}
          </div>

          <div style={{ padding: "16px 14px", borderBottom: "1px solid #111" }}>
            <p style={{ color: "#F5C518", fontSize: 8, letterSpacing: 2, fontFamily: "'Anton',sans-serif", marginBottom: 12 }}>BROWSE & FILTER</p>
            <p style={{ color: "#333", fontSize: 7, letterSpacing: 2, fontFamily: "'Space Mono',monospace", marginBottom: 6 }}>GENRE</p>
            {genres.map((g) => <Item key={g} label={g} active={selectedGenre === g} onClick={() => setSelectedGenre(g)} />)}
            <p style={{ color: "#333", fontSize: 7, letterSpacing: 2, fontFamily: "'Space Mono',monospace", margin: "14px 0 6px" }}>YEAR</p>
            {years.map((y) => <Item key={y} label={y} active={selectedYear === y} onClick={() => setSelectedYear(y)} />)}
            <p style={{ color: "#333", fontSize: 7, letterSpacing: 2, fontFamily: "'Space Mono',monospace", margin: "14px 0 6px" }}>IMDb RATING</p>
            {["All", "9+", "8.5+", "8+", "7.5+"].map((r) => <Item key={r} label={r === "All" ? "All Ratings" : `⭐ ${r}`} active={selectedRating === r} onClick={() => setSelectedRating(r)} />)}
          </div>

          <div style={{ padding: "16px 14px 32px" }}>
            <p style={{ color: "#F5C518", fontSize: 8, letterSpacing: 2, fontFamily: "'Anton',sans-serif", marginBottom: 12 }}>ALL MOVIES <span style={{ color: "#444", fontSize: 7 }}>({movies.length})</span></p>
            {movies.map((m) => (
              <div key={m.id} onClick={() => { onMovieClick(m); onClose(); }} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 4, transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#141414"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <img src={getPoster(m.poster)} alt={m.title} style={{ width: 36, height: 54, objectFit: "cover", borderRadius: 5, flexShrink: 0 }} onError={(e) => { e.target.src = `https://placehold.co/36x54/1a1a1a/F5C518?text=?`; }} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: "'Anton',sans-serif", fontSize: 12, color: "#fff", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</p>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ color: "#F5C518", fontSize: 9, fontFamily: "'Space Mono',monospace" }}>{m.year}</span>
                    <span style={{ color: "#333", fontSize: 8 }}>·</span>
                    <span style={{ background: "#F5C518", borderRadius: 3, padding: "0px 4px", fontSize: 7, color: "#000", fontFamily: "'Anton',sans-serif" }}>IMDb {m.imdb}</span>
                  </div>
                </div>
                {m.featured && <span style={{ marginLeft: "auto", fontSize: 8, color: "#F5C518", flexShrink: 0 }}>★</span>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "12px 14px", borderTop: "1px solid #1a1a1a", flexShrink: 0 }}>
          <button onClick={onClose} style={{ width: "100%", background: "#F5C518", border: "none", color: "#000", padding: "12px 0", borderRadius: 10, cursor: "pointer", fontFamily: "'Anton',sans-serif", fontSize: 14, letterSpacing: 1 }}>
            APPLY & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
