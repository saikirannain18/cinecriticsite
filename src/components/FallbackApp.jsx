import React, { useState } from 'react';
import { getPoster } from '../utils/helpers';
import { MovieModal } from './movie/MovieModal';

const FALLBACK_MOVIES = [
  { id: "1",  title: "Oppenheimer",                       year: 2023, genre: ["Drama", "History"],     imdb: 8.9, director: "Christopher Nolan",   poster: "https://image.tmdb.org/t/p/w1280/8Gxv8giaFIzmZTKykFCdna8FAUh.jpg",  review: "A stunning, profound portrait of the man who split the world apart. Nolan's magnum opus delivers unparalleled tension and breathtaking cinematography.",  reviewer: "Alex Turner", featured: true,  rating: "R",     runtime: "180 min" },
  { id: "2",  title: "Dune: Part Two",                    year: 2024, genre: ["Sci-Fi", "Adventure"],  imdb: 8.5, director: "Denis Villeneuve",     poster: "https://image.tmdb.org/t/p/w1280/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",  review: "Epic in every sense. Villeneuve completes his vision with jaw-dropping scale and performances that haunt you long after the credits roll.",             reviewer: "Alex Turner", featured: true,  rating: "PG-13", runtime: "166 min" },
  { id: "3",  title: "The Batman",                        year: 2022, genre: ["Action", "Crime"],      imdb: 7.8, director: "Matt Reeves",          poster: "https://image.tmdb.org/t/p/w1280/74xTEgt7R36Fpooo50r9T25onhq.jpg",  review: "Dark, brooding and methodical. Reeves reinvents the Caped Crusader as a noir detective. Pattinson is revelatory.",                                    reviewer: "Alex Turner", featured: false, rating: "PG-13", runtime: "176 min" },
];

export function FallbackApp() {
  const [sel, setSel] = useState(null);
  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Lora:ital,wght@0,400;1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <nav style={{ background: "#0d0d0d", borderBottom: "1px solid #1a1a1a", padding: "0 16px", height: 56, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 24, height: 24, background: "#F5C518", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🎬</div>
        <span style={{ fontFamily: "'Anton',sans-serif", fontSize: 18, letterSpacing: 2 }}>CINE<span style={{ color: "#F5C518" }}>CRITIC</span></span>
        <span style={{ marginLeft: "auto", background: "#1a1200", border: "1px solid #F5C51860", color: "#F5C518", fontSize: 9, fontFamily: "'Space Mono',monospace", padding: "3px 8px", borderRadius: 5 }}>● DEMO</span>
      </nav>
      <main style={{ padding: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12 }}>
          {FALLBACK_MOVIES.map(m => (
            <div key={m.id} onClick={() => setSel(m)} style={{ cursor: "pointer", borderRadius: 10, overflow: "hidden", background: "#141414", border: "1px solid #222" }}>
              <img src={getPoster(m.poster)} alt={m.title} style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }} onError={e => { e.target.src = `https://placehold.co/300x450/1a1a1a/F5C518?text=${encodeURIComponent(m.title)}`; }} />
              <div style={{ padding: "8px 10px" }}>
                <p style={{ fontFamily: "'Anton',sans-serif", fontSize: 12, color: "#fff", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</p>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: "#F5C518" }}>{m.year}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      {sel && <MovieModal movie={sel} onClose={() => setSel(null)} />}
    </div>
  );
}
