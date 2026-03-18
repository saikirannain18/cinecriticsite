import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { GenreBar, ActiveFilters } from '../components/ui/FilterBars';
import { MovieCard } from '../components/ui/MovieCard';
import { applyFilters } from '../utils/helpers';

export const MostPopularPage = ({
  movies, onMovieClick, isMobile,
  selectedGenre, setSelectedGenre, selectedYear, setSelectedYear,
  selectedRating, setSelectedRating
}) => {
  const genres = [...new Set(movies.flatMap(m => m.genre || []))].sort();
  const clearAll = () => { setSelectedGenre("All"); setSelectedYear("All"); setSelectedRating("All"); };
  const popular = applyFilters(
    [...movies].map(m => ({ ...m, _pop: m.imdb + Math.max(0, (m.year - 2000) * 0.05) })).sort((a, b) => b._pop - a._pop),
    selectedGenre, selectedYear, selectedRating
  );

  return (
    <PageWrapper title="MOST POPULAR" subtitle="Trending picks — ranked by popularity score" icon="🌟" accentColor="#a78bfa">
      <GenreBar genres={genres} selected={selectedGenre} onSelect={setSelectedGenre} />
      <ActiveFilters selectedGenre={selectedGenre} selectedYear={selectedYear} selectedRating={selectedRating} onClear={clearAll} />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(auto-fill,minmax(155px,1fr))", gap: isMobile ? 10 : 14 }}>
        {popular.length === 0
          ? <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 0", color: "#333" }}><div style={{ fontSize: 32, marginBottom: 10 }}>🎬</div><p style={{ fontFamily: "'Lora',serif" }}>No movies match your filters.</p></div>
          : popular.map(m => <MovieCard key={m.id} movie={m} onClick={onMovieClick} isMobile={isMobile} />)}
      </div>
    </PageWrapper>
  );
};
