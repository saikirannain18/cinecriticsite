import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { GenreBar, YearBar, ActiveFilters } from '../components/ui/FilterBars';
import { MovieCard } from '../components/ui/MovieCard';
import { applyFilters } from '../utils/helpers';

export const NewReleasesPage = ({
  movies, onMovieClick, isMobile,
  selectedGenre, setSelectedGenre, selectedYear, setSelectedYear,
  selectedRating, setSelectedRating
}) => {
  const genres = [...new Set(movies.flatMap(m => m.genre || []))].sort();
  const years = [...new Set(movies.map(m => String(m.year)))].sort((a, b) => b - a);
  const clearAll = () => { setSelectedGenre("All"); setSelectedYear("All"); setSelectedRating("All"); };

  const sorted = applyFilters([...movies].sort((a, b) => b.year - a.year), selectedGenre, selectedYear, selectedRating);
  const grouped = sorted.reduce((acc, m) => {
    const y = String(m.year);
    if (!acc[y]) acc[y] = [];
    acc[y].push(m);
    return acc;
  }, {});

  return (
    <PageWrapper title="NEW RELEASES" subtitle="Sorted by release year — newest first" icon="🆕" accentColor="#4caf50">
      <GenreBar genres={genres} selected={selectedGenre} onSelect={setSelectedGenre} />
      <YearBar years={years} selected={selectedYear} onSelect={setSelectedYear} accentColor="#4caf50" />
      <ActiveFilters selectedGenre={selectedGenre} selectedYear={selectedYear} selectedRating={selectedRating} onClear={clearAll} />
      {Object.keys(grouped).length === 0
        ? <div style={{ textAlign: "center", padding: "48px 0", color: "#333" }}><div style={{ fontSize: 32, marginBottom: 10 }}>🎬</div><p style={{ fontFamily: "'Lora',serif" }}>No movies match your filters.</p></div>
        : Object.entries(grouped).map(([year, ym]) => (
          <div key={year} style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ background: "#4caf5020", border: "1px solid #4caf5040", borderRadius: 7, padding: "3px 12px" }}>
                <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 17, color: "#4caf50" }}>{year}</span>
              </div>
              <span style={{ color: "#333", fontSize: 9, fontFamily: "'Space Mono',monospace" }}>{ym.length} film{ym.length !== 1 ? "s" : ""}</span>
              <div style={{ flex: 1, height: 1, background: "#111" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(auto-fill,minmax(155px,1fr))", gap: isMobile ? 10 : 14 }}>
              {ym.map(m => <MovieCard key={m.id} movie={m} onClick={onMovieClick} isMobile={isMobile} />)}
            </div>
          </div>
        ))}
    </PageWrapper>
  );
};
