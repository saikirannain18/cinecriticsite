export function getPoster(url, size = "w500") {
  if (!url) return "";
  return url
    .replace(/\/t\/p\/w\d+\//, `/t/p/${size}/`)
    .replace(/\/t\/p\/original\//, `/t/p/${size}/`);
}
export function applyFilters(movies, selectedGenre, selectedYear, selectedRating) { return movies.filter(m => { if (selectedGenre !== 'All' && !(m.genre||[]).includes(selectedGenre)) return false; if (selectedYear !== 'All' && String(m.year) !== selectedYear) return false; if (selectedRating !== 'All' && m.imdb < parseFloat(selectedRating)) return false; return true; }); }
