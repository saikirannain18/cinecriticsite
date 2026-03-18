import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { GenreBar, ActiveFilters } from '../components/ui/FilterBars';
import { ImdbBadge } from '../components/ui/ImdbBadge';
import { applyFilters, getPoster } from '../utils/helpers';

export const ReleaseCalendarPage = ({
  movies, onMovieClick,
  selectedGenre, setSelectedGenre, selectedYear, setSelectedYear,
  selectedRating, setSelectedRating
}) => {
  const genres = [...new Set(movies.flatMap(m => m.genre || []))].sort();
  const clearAll = () => { setSelectedGenre("All"); setSelectedYear("All"); setSelectedRating("All"); };
  const filtered = applyFilters([...movies].sort((a, b) => b.year - a.year), selectedGenre, selectedYear, selectedRating);
  
  const decades = filtered.reduce((acc, m) => {
    const l = `${Math.floor(m.year / 10) * 10}s`;
    if (!acc[l]) acc[l] = [];
    acc[l].push(m);
    return acc;
  }, {});
  
  const colors = { "2020s": "#F5C518", "2010s": "#4caf50", "2000s": "#a78bfa", "1990s": "#f97316", "1980s": "#ec4899", "1970s": "#06b6d4" };

  return (
    <PageWrapper title="RELEASE CALENDAR" subtitle="Browse your collection by era and decade" icon="📅" accentColor="#F5C518">
      <GenreBar genres={genres} selected={selectedGenre} onSelect={setSelectedGenre} />
      <ActiveFilters selectedGenre={selectedGenre} selectedYear={selectedYear} selectedRating={selectedRating} onClear={clearAll} />
      {Object.keys(decades).length === 0
        ? <div style={{ textAlign: "center", padding: "48px 0", color: "#333" }}><div style={{ fontSize: 32, marginBottom: 10 }}>📅</div><p style={{ fontFamily: "'Lora',serif" }}>No movies match your filters.</p></div>
        : Object.entries(decades).map(([decade, dm]) => {
          const c = colors[decade] || "#888";
          return (
            <div key={decade} style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ background: `${c}15`, border: `1px solid ${c}40`, borderRadius: 9, padding: "5px 16px" }}>
                  <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 20, color: c, letterSpacing: 2 }}>{decade}</span>
                </div>
                <span style={{ color: "#333", fontSize: 9, fontFamily: "'Space Mono',monospace" }}>
                  {dm.length} film{dm.length !== 1 ? "s" : ""} · {dm[dm.length - 1].year}–{dm[0].year}
                </span>
                <div style={{ flex: 1, height: 1, background: "#111" }} />
              </div>
              <div style={{ background: "#0a0a0a", borderRadius: 12, border: "1px solid #141414", overflow: "hidden" }}>
                {dm.map((m, i) => (
                  <div key={m.id} onClick={() => onMovieClick(m)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                      borderBottom: i < dm.length - 1 ? "1px solid #0f0f0f" : "none",
                      cursor: "pointer", transition: "background 0.15s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#141414"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <img src={getPoster(m.poster)} alt={m.title}
                      style={{ width: 38, height: 56, objectFit: "cover", display: "block", WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden", borderRadius: 5, flexShrink: 0 }}
                      onError={e => { e.target.src = `https://placehold.co/38x56/1a1a1a/888?text=?`; }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontFamily: "'Anton',sans-serif", fontSize: 13, color: "#fff",
                        margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                      }}>{m.title}</p>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ color: c, fontFamily: "'Space Mono',monospace", fontSize: 9 }}>{m.year}</span>
                        <span style={{ color: "#333" }}>·</span>
                        <span style={{ color: "#555", fontSize: 9 }}>{m.runtime}</span>
                      </div>
                    </div>
                    <ImdbBadge score={m.imdb} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </PageWrapper>
  );
};
