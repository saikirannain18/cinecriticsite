import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { GenreBar, ActiveFilters } from '../components/ui/FilterBars';
import { MovieRow } from '../components/ui/MovieRow';
import { applyFilters } from '../utils/helpers';

export const Top250Page = ({
  movies, onMovieClick,
  selectedGenre, setSelectedGenre, selectedYear, setSelectedYear,
  selectedRating, setSelectedRating, title = "TOP 250 MOVIES"
}) => {
  const genres = [...new Set(movies.flatMap(m => m.genre || []))].sort();
  const clearAll = () => { setSelectedGenre("All"); setSelectedYear("All"); setSelectedRating("All"); };
  const ranked = applyFilters([...movies].sort((a, b) => b.imdb - a.imdb).slice(0, 250), selectedGenre, selectedYear, selectedRating);

  return (
    <PageWrapper title={title} subtitle="Highest rated films — ranked by IMDb score" icon="🏆" accentColor="#F5C518">
      <GenreBar genres={genres} selected={selectedGenre} onSelect={setSelectedGenre} />
      <ActiveFilters selectedGenre={selectedGenre} selectedYear={selectedYear} selectedRating={selectedRating} onClear={clearAll} />
      <div style={{ display: "flex", gap: 20, marginBottom: 16, padding: "10px 14px", background: "#0d0d0d", borderRadius: 10, border: "1px solid #1a1a1a" }}>
        <div>
          <p style={{ color: "#333", fontSize: 7, fontFamily: "'Space Mono',monospace", letterSpacing: 2, margin: "0 0 2px" }}>SHOWING</p>
          <p style={{ color: "#F5C518", fontFamily: "'Anton',sans-serif", fontSize: 18, margin: 0 }}>{ranked.length}</p>
        </div>
        <div>
          <p style={{ color: "#333", fontSize: 7, fontFamily: "'Space Mono',monospace", letterSpacing: 2, margin: "0 0 2px" }}>TOP SCORE</p>
          <p style={{ color: "#fff", fontFamily: "'Anton',sans-serif", fontSize: 18, margin: 0 }}>{ranked[0]?.imdb || "—"}</p>
        </div>
      </div>
      <div style={{ background: "#0a0a0a", borderRadius: 12, border: "1px solid #141414", overflow: "hidden" }}>
        {ranked.length === 0
          ? <div style={{ textAlign: "center", padding: "48px 0", color: "#333" }}><div style={{ fontSize: 32, marginBottom: 10 }}>🎬</div><p style={{ fontFamily: "'Lora',serif" }}>No movies match your filters.</p></div>
          : ranked.map((m, i) => <MovieRow key={m.id} movie={m} rank={i + 1} onClick={onMovieClick} accentColor="#F5C518" />)}
      </div>
    </PageWrapper>
  );
};
