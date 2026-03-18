import React from 'react';
import { HeroBanner } from '../components/ui/HeroBanner';
import { GenreBar, ActiveFilters } from '../components/ui/FilterBars';
import { MovieCard } from '../components/ui/MovieCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';

export const Home = ({
  movies, loading, featured, heroIndex, setHeroIndex, onMovieClick, isMobile,
  selectedGenre, setSelectedGenre, selectedYear, setSelectedYear,
  selectedRating, setSelectedRating, search
}) => {
  const genres = ["All", ...Array.from(new Set(movies.flatMap(m => m.genre || [])))].sort();

  // Apply filters including search specifically for Home
  const filtered = movies.filter(m => {
    if (selectedGenre !== "All" && !(m.genre || []).includes(selectedGenre)) return false;
    if (selectedYear !== "All" && String(m.year) !== selectedYear) return false;
    if (selectedRating !== "All") {
      if (m.imdb < parseFloat(selectedRating.replace("+", ""))) return false;
    }
    const q = search.toLowerCase();
    if (q && !m.title?.toLowerCase().includes(q) && !m.director?.toLowerCase().includes(q)) return false;
    return true;
  });

  const clearFilters = () => {
    setSelectedGenre("All"); setSelectedYear("All"); setSelectedRating("All");
  };

  const sectionTitle = () => {
    if (search) return `Results for "${search}"`;
    if (selectedGenre !== "All") return selectedGenre.toUpperCase();
    return "LATEST IN CINEMA";
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Search results or filtered state replaces hero banner unless it's just all movies */}
      {!search && selectedGenre === "All" && selectedYear === "All" && selectedRating === "All" && featured.length > 0 && (
        <HeroBanner 
          movie={featured[heroIndex]} 
          onClick={onMovieClick} 
          isMobile={isMobile} 
          featured={featured}
          heroIndex={heroIndex}
          setHeroIndex={setHeroIndex}
        />
      )}

      {/* Hero skeletons while loading if no filters */}
      {loading && !search && selectedGenre === "All" && (
        <div style={{
          height: isMobile ? 200 : 340, background: "#111", borderRadius: isMobile ? 12 : 16,
          marginBottom: isMobile ? 16 : 24, animation: "shimmer 1.4s infinite"
        }} />
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontFamily: "'Anton',sans-serif", fontSize: isMobile ? 18 : 22, letterSpacing: 2, margin: 0, color: "#fff" }}>
          {sectionTitle()}
        </h2>
        {filtered.length > 0 && (
          <span style={{ color: "#555", fontSize: 10, fontFamily: "'Space Mono',monospace" }}>
            {filtered.length} TITLES
          </span>
        )}
      </div>

      <GenreBar genres={genres} selected={selectedGenre} onSelect={setSelectedGenre} />
      
      {/* Active Filters */}
      <ActiveFilters selectedGenre={selectedGenre} selectedYear={selectedYear} selectedRating={selectedRating} onClear={clearFilters} />

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(auto-fill,minmax(155px,1fr))", gap: isMobile ? 10 : 14 }}>
          {Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#0d0d0d", borderRadius: 16, border: "1px dashed #222" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🍿</div>
          <p style={{ color: "#fff", fontFamily: "'Anton',sans-serif", fontSize: 20, letterSpacing: 1, margin: "0 0 8px" }}>NO MOVIES FOUND</p>
          <p style={{ color: "#666", fontSize: 13, fontFamily: "'Lora',serif", maxWidth: 300, margin: "0 auto 20px" }}>We couldn't find any films matching your exact filters. Try broadening your search.</p>
          <button onClick={clearFilters} style={{ background: "#F5C518", border: "none", color: "#000", padding: "10px 24px", borderRadius: 20, cursor: "pointer", fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: "bold" }}>
            CLEAR FILTERS
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(auto-fill,minmax(155px,1fr))", gap: isMobile ? 10 : 14 }}>
          {filtered.map(m => <MovieCard key={m.id} movie={m} onClick={onMovieClick} isMobile={isMobile} />)}
        </div>
      )}
    </div>
  );
};
