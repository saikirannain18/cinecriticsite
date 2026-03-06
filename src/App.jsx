import { useState, useEffect, Component } from "react";

// ─────────────────────────────────────────────────────────────────────
// 🔥 FIREBASE CONFIG
// Replace these values with YOUR project's config from:
// console.firebase.google.com → Project Settings → Your Apps
// ─────────────────────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

// ─────────────────────────────────────────────────────────────────────
// FALLBACK DATA — always shown if Firebase is down / not configured /
// slow / returns empty. Site NEVER shows a blank screen.
// ─────────────────────────────────────────────────────────────────────
const FALLBACK_MOVIES = [
  { id: "1",  title: "Oppenheimer",                    year: 2023, genre: ["Drama", "History"],          imdb: 8.9, director: "Christopher Nolan",    poster: "https://image.tmdb.org/t/p/w500/8Gxv8giaFIzmZTKykFCdna8FAUh.jpg",  review: "A stunning, profound portrait of the man who split the world apart. Nolan's magnum opus delivers unparalleled tension and breathtaking cinematography.",  reviewer: "Alex Turner", featured: true,  rating: "R",     runtime: "180 min" },
  { id: "2",  title: "Dune: Part Two",                 year: 2024, genre: ["Sci-Fi", "Adventure"],       imdb: 8.5, director: "Denis Villeneuve",      poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",  review: "Epic in every sense. Villeneuve completes his vision with jaw-dropping scale and performances that haunt you long after the credits roll.",             reviewer: "Alex Turner", featured: true,  rating: "PG-13", runtime: "166 min" },
  { id: "3",  title: "The Batman",                     year: 2022, genre: ["Action", "Crime"],           imdb: 7.8, director: "Matt Reeves",           poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",  review: "Dark, brooding and methodical. Reeves reinvents the Caped Crusader as a noir detective. Pattinson is revelatory.",                                    reviewer: "Alex Turner", featured: false, rating: "PG-13", runtime: "176 min" },
  { id: "4",  title: "Parasite",                       year: 2019, genre: ["Thriller", "Drama"],         imdb: 8.5, director: "Bong Joon-ho",          poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",  review: "A perfectly constructed social thriller that shifts genre like a snake shedding skin. Unmissable cinema.",                                            reviewer: "Alex Turner", featured: false, rating: "R",     runtime: "132 min" },
  { id: "5",  title: "The Godfather",                  year: 1972, genre: ["Crime", "Drama"],            imdb: 9.2, director: "Francis Ford Coppola",  poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLeBMapLGMGw.jpg",  review: "The pinnacle of American cinema. Coppola's epic remains the benchmark against which all crime films are measured.",                                    reviewer: "Alex Turner", featured: true,  rating: "R",     runtime: "175 min" },
  { id: "6",  title: "Interstellar",                   year: 2014, genre: ["Sci-Fi", "Adventure"],       imdb: 8.7, director: "Christopher Nolan",    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIE.jpg",  review: "A transcendent journey across space and time. Nolan blends hard science with raw parental love to create one of cinema's most ambitious achievements.", reviewer: "Alex Turner", featured: false, rating: "PG-13", runtime: "169 min" },
  { id: "7",  title: "Inception",                      year: 2010, genre: ["Action", "Sci-Fi"],          imdb: 8.8, director: "Christopher Nolan",    poster: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",  review: "A labyrinthine puzzle wrapped in a blockbuster. Nolan makes the impossible feel visceral and emotionally resonant through sheer filmmaking bravado.",   reviewer: "Alex Turner", featured: false, rating: "PG-13", runtime: "148 min" },
  { id: "8",  title: "Whiplash",                       year: 2014, genre: ["Drama", "Music"],            imdb: 8.5, director: "Damien Chazelle",       poster: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",  review: "The most visceral film about artistic obsession ever made. Chazelle and Simmons turn a music drama into a psychological war. Pure adrenaline.",         reviewer: "Alex Turner", featured: false, rating: "R",     runtime: "107 min" },
  { id: "9",  title: "Everything Everywhere All at Once", year: 2022, genre: ["Comedy", "Sci-Fi"],      imdb: 7.8, director: "Daniel Kwan",           poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",  review: "Audacious, chaotic, and unexpectedly moving. The Daniels craft a multiverse epic about love and identity with astonishing emotional depth.",             reviewer: "Alex Turner", featured: false, rating: "R",     runtime: "139 min" },
  { id: "10", title: "Mad Max: Fury Road",              year: 2015, genre: ["Action", "Adventure"],      imdb: 8.1, director: "George Miller",         poster: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",  review: "Two hours of relentless operatic stunt-driven cinema. Miller's return is a lesson in pure action filmmaking that puts modern blockbusters to shame.",   reviewer: "Alex Turner", featured: false, rating: "R",     runtime: "120 min" },
  { id: "11", title: "Joker",                           year: 2019, genre: ["Crime", "Drama"],           imdb: 8.4, director: "Todd Phillips",         poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",  review: "Phoenix transforms himself completely. A deeply uncomfortable character study that dares to make a monster sympathetic, wrapped in Scorsese-esque bravura.", reviewer: "Alex Turner", featured: false, rating: "R", runtime: "122 min" },
  { id: "12", title: "The Dark Knight",                 year: 2008, genre: ["Action", "Crime"],          imdb: 9.0, director: "Christopher Nolan",    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",  review: "Ledger's Joker is one of cinema's greatest villains. Nolan elevates superhero storytelling into genuine moral tragedy. A masterpiece.",                  reviewer: "Alex Turner", featured: true,  rating: "PG-13", runtime: "152 min" },
];

const RATINGS_FILTER = ["All", "9+", "8.5+", "8+", "7.5+"];

// ─────────────────────────────────────────────────────────────────────
// SAFETY CHECKS
// ─────────────────────────────────────────────────────────────────────

// Returns true if the user has NOT yet replaced the placeholder config
function isPlaceholderConfig() {
  return (
    !FIREBASE_CONFIG.apiKey ||
    FIREBASE_CONFIG.apiKey === "YOUR_API_KEY" ||
    FIREBASE_CONFIG.projectId === "YOUR_PROJECT_ID" ||
    FIREBASE_CONFIG.projectId === ""
  );
}

// ─────────────────────────────────────────────────────────────────────
// FIREBASE LOADER — dynamically imports Firebase SDK
// Has a hard 8-second timeout. Falls back to demo data on ANY failure.
// ─────────────────────────────────────────────────────────────────────
let _firebase = null;

function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), ms)
  );
  return Promise.race([promise, timeout]);
}

async function getFirebase() {
  if (_firebase) return _firebase;

  // Skip Firebase entirely if config is still placeholder
  if (isPlaceholderConfig()) return null;

  try {
    const [{ initializeApp, getApps }, { getFirestore, collection, onSnapshot }] =
      await withTimeout(
        Promise.all([
          import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"),
          import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"),
        ]),
        8000  // give up after 8 seconds → load demo data
      );

    const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
    const fs  = getFirestore(app);
    _firebase = { fs, collection, onSnapshot };
    return _firebase;
  } catch {
    return null;   // any error → caller will use FALLBACK_MOVIES
  }
}

// ─────────────────────────────────────────────────────────────────────
// ERROR BOUNDARY — catches React render crashes and shows fallback UI
// ─────────────────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { crashed: false };
  }
  static getDerivedStateFromError() {
    return { crashed: true };
  }
  render() {
    if (this.state.crashed) {
      // Render a standalone fallback that doesn't depend on any state
      return <FallbackApp />;
    }
    return this.props.children;
  }
}

// Minimal standalone app shown if the main App crashes completely
function FallbackApp() {
  const [sel, setSel] = useState(null);
  return (
    <div style={{ minHeight:"100vh", background:"#080808", color:"#fff", fontFamily:"sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Lora:ital,wght@0,400;1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <nav style={{ background:"#0d0d0d", borderBottom:"1px solid #1a1a1a", padding:"0 20px", height:60, display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:26, height:26, background:"#F5C518", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center" }}>🎬</div>
        <span style={{ fontFamily:"'Anton',sans-serif", fontSize:20, letterSpacing:2 }}>CINE<span style={{ color:"#F5C518" }}>CRITIC</span></span>
        <span style={{ marginLeft:"auto", background:"#1a1200", border:"1px solid #F5C51860", color:"#F5C518", fontSize:9, fontFamily:"'Space Mono',monospace", padding:"4px 10px", borderRadius:5 }}>● DEMO MODE</span>
      </nav>
      <main style={{ padding:"28px 24px" }}>
        <h2 style={{ fontFamily:"'Anton',sans-serif", fontSize:20, letterSpacing:1, marginBottom:16 }}>ALL MOVIES</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(165px,1fr))", gap:16 }}>
          {FALLBACK_MOVIES.map(m => (
            <div key={m.id} onClick={() => setSel(m)} style={{ cursor:"pointer", borderRadius:12, overflow:"hidden", background:"#141414", border:"1px solid #222" }}>
              <img src={m.poster} alt={m.title} style={{ width:"100%", aspectRatio:"2/3", objectFit:"cover" }}
                onError={e => { e.target.src=`https://placehold.co/300x450/1a1a1a/F5C518?text=${encodeURIComponent(m.title)}`; }} />
              <div style={{ padding:"10px 12px" }}>
                <p style={{ fontFamily:"'Anton',sans-serif", fontSize:13, color:"#fff", margin:"0 0 3px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m.title}</p>
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, color:"#F5C518" }}>{m.year}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      {sel && (
        <div onClick={() => setSel(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, zIndex:999, backdropFilter:"blur(8px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#0f0f0f", border:"1px solid #222", borderRadius:16, maxWidth:600, width:"100%", overflow:"hidden" }}>
            <div style={{ display:"flex" }}>
              <img src={sel.poster} alt={sel.title} style={{ width:200, objectFit:"cover" }} onError={e => { e.target.src=`https://placehold.co/200x300/1a1a1a/F5C518?text=${encodeURIComponent(sel.title)}`; }} />
              <div style={{ padding:"22px", flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <h2 style={{ fontFamily:"'Anton',sans-serif", fontSize:22, color:"#fff", margin:0 }}>{sel.title}</h2>
                  <button onClick={() => setSel(null)} style={{ background:"none", border:"1px solid #333", color:"#666", cursor:"pointer", borderRadius:"50%", width:28, height:28 }}>✕</button>
                </div>
                <p style={{ color:"#F5C518", fontFamily:"'Space Mono',monospace", fontSize:11, margin:"6px 0 10px" }}>{sel.year} · {sel.runtime}</p>
                <div style={{ background:"#F5C518", display:"inline-flex", gap:5, borderRadius:4, padding:"2px 8px", marginBottom:12 }}>
                  <span style={{ fontSize:9, color:"#000", fontFamily:"'Anton',sans-serif", letterSpacing:1 }}>IMDb</span>
                  <span style={{ fontSize:13, color:"#000", fontWeight:700, fontFamily:"'Anton',sans-serif" }}>{sel.imdb}</span>
                </div>
                <p style={{ color:"#ccc", fontFamily:"'Lora',serif", fontSize:12, lineHeight:1.7, fontStyle:"italic", margin:"0 0 10px" }}>"{sel.review}"</p>
                <p style={{ color:"#444", fontFamily:"'Space Mono',monospace", fontSize:10 }}>Dir. {sel.director}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// SMALL UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────
const StarRating = ({ score }) => {
  const filled = Math.round(score / 2);
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} width="12" height="12" viewBox="0 0 24 24"
          fill={s <= filled ? "#F5C518" : "none"} stroke="#F5C518" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
};

const ImdbBadge = ({ score }) => (
  <div style={{ display:"flex", alignItems:"center", gap:5, background:"#F5C518", borderRadius:4, padding:"2px 7px" }}>
    <span style={{ fontFamily:"'Anton',sans-serif", fontSize:9, color:"#000", letterSpacing:1 }}>IMDb</span>
    <span style={{ fontFamily:"'Anton',sans-serif", fontSize:12, color:"#000", fontWeight:700 }}>{score}</span>
  </div>
);

// Skeleton loader card shown while data is fetching
const SkeletonCard = () => (
  <div style={{ borderRadius:12, overflow:"hidden", background:"#141414", border:"1px solid #1e1e1e" }}>
    <div style={{ aspectRatio:"2/3", background:"#1e1e1e", animation:"shimmer 1.4s ease-in-out infinite" }} />
    <div style={{ padding:"11px 13px 14px" }}>
      <div style={{ height:13, background:"#1e1e1e", borderRadius:4, marginBottom:8, animation:"shimmer 1.4s ease-in-out infinite" }} />
      <div style={{ height:10, background:"#1a1a1a", borderRadius:4, width:"60%", animation:"shimmer 1.4s ease-in-out infinite" }} />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────
// MOVIE CARD
// ─────────────────────────────────────────────────────────────────────
const MovieCard = ({ movie, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(movie)}
      style={{
        borderRadius: 12, overflow: "hidden", background: "#141414", cursor: "pointer",
        border:     hovered ? "1px solid #F5C518" : "1px solid #222",
        transform:  hovered ? "translateY(-6px) scale(1.02)" : "none",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow:  hovered ? "0 20px 44px rgba(245,197,24,0.2)" : "0 4px 16px rgba(0,0,0,0.5)",
      }}>
      {/* Poster */}
      <div style={{ position:"relative", aspectRatio:"2/3", overflow:"hidden" }}>
        <img
          src={movie.poster}
          alt={movie.title}
          style={{ width:"100%", height:"100%", objectFit:"cover", transform: hovered ? "scale(1.08)" : "scale(1)", transition:"transform 0.4s ease" }}
          onError={e => { e.target.src = `https://placehold.co/300x450/1a1a1a/F5C518?text=${encodeURIComponent(movie.title)}`; }}
        />
        {/* gradient overlay */}
        <div style={{ position:"absolute", inset:0, background: hovered
          ? "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)"
          : "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)",
          transition:"all 0.3s ease" }} />

        {/* IMDb badge */}
        <div style={{ position:"absolute", top:8, right:8 }}>
          <ImdbBadge score={movie.imdb} />
        </div>

        {/* Featured badge */}
        {movie.featured && (
          <div style={{ position:"absolute", top:8, left:8, background:"#F5C518", borderRadius:3, padding:"2px 7px" }}>
            <span style={{ fontFamily:"'Anton',sans-serif", fontSize:8, color:"#000", letterSpacing:1 }}>FEATURED</span>
          </div>
        )}

        {/* Review preview on hover */}
        {hovered && (
          <div style={{ position:"absolute", bottom:0, padding:"10px 12px" }}>
            <p style={{ color:"#ddd", fontSize:10, fontFamily:"'Lora',serif", fontStyle:"italic",
              lineHeight:1.55, margin:0, display:"-webkit-box",
              WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
              {movie.review}
            </p>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding:"11px 13px 12px" }}>
        <h3 style={{ margin:"0 0 3px", color:"#fff", fontSize:13, fontFamily:"'Anton',sans-serif",
          whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
          {movie.title}
        </h3>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
          <span style={{ color:"#F5C518", fontSize:10, fontFamily:"'Space Mono',monospace" }}>{movie.year}</span>
          <span style={{ color:"#555", fontSize:9,  fontFamily:"'Space Mono',monospace" }}>{movie.runtime}</span>
        </div>
        <StarRating score={movie.imdb} />
        <div style={{ marginTop:7, display:"flex", flexWrap:"wrap", gap:3 }}>
          {(movie.genre || []).slice(0, 2).map(g => (
            <span key={g} style={{ background:"#1e1e1e", border:"1px solid #2a2a2a", borderRadius:20,
              padding:"1px 7px", fontSize:8, color:"#888", fontFamily:"'Space Mono',monospace" }}>{g}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────
// HERO BANNER (featured movies auto-rotate)
// ─────────────────────────────────────────────────────────────────────
const HeroBanner = ({ movie, onClick }) => {
  const [hov, setHov] = useState(false);
  if (!movie) return null;
  return (
    <div
      onClick={() => onClick(movie)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:"relative", borderRadius:16, overflow:"hidden", cursor:"pointer",
        marginBottom:28, height:360,
        boxShadow: hov ? "0 28px 56px rgba(245,197,24,0.16)" : "0 10px 40px rgba(0,0,0,0.6)",
        transition:"box-shadow 0.3s ease",
      }}>
      <img
        src={movie.poster} alt={movie.title}
        style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top",
          filter:"brightness(0.38)", transform: hov ? "scale(1.03)" : "scale(1)", transition:"transform 0.5s ease" }}
        onError={e => { e.target.src = `https://placehold.co/1200x360/0a0a0a/F5C518?text=${encodeURIComponent(movie.title)}`; }}
      />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(110deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.44) 55%, transparent 100%)" }} />

      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"28px 32px" }}>
        <div style={{ display:"flex", gap:10, marginBottom:8, alignItems:"center" }}>
          <span style={{ background:"#F5C518", color:"#000", fontSize:9, fontFamily:"'Anton',sans-serif", letterSpacing:2, padding:"3px 9px", borderRadius:3 }}>FEATURED REVIEW</span>
          <ImdbBadge score={movie.imdb} />
        </div>
        <h2 style={{ margin:"0 0 6px", color:"#fff", fontSize:38, fontFamily:"'Anton',sans-serif", letterSpacing:1, lineHeight:1 }}>{movie.title}</h2>
        <div style={{ display:"flex", gap:14, marginBottom:10, alignItems:"center" }}>
          <span style={{ color:"#F5C518", fontFamily:"'Space Mono',monospace", fontSize:11 }}>{movie.year}</span>
          <span style={{ color:"#444" }}>•</span>
          <span style={{ color:"#999", fontSize:10, fontFamily:"'Space Mono',monospace" }}>Dir. {movie.director}</span>
          <span style={{ color:"#444" }}>•</span>
          <span style={{ color:"#999", fontSize:10, fontFamily:"'Space Mono',monospace" }}>{movie.runtime}</span>
        </div>
        <p style={{ color:"#ccc", fontFamily:"'Lora',serif", fontSize:13, lineHeight:1.65,
          maxWidth:520, margin:"0 0 10px", fontStyle:"italic" }}>"{movie.review}"</p>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <StarRating score={movie.imdb} />
          <span style={{ color:"#555", fontFamily:"'Space Mono',monospace", fontSize:10 }}>— {movie.reviewer}</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────
// DETAIL MODAL
// ─────────────────────────────────────────────────────────────────────
const Modal = ({ movie, onClose }) => {
  // close on Escape key
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!movie) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:2000, background:"rgba(0,0,0,0.88)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:20, backdropFilter:"blur(10px)" }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background:"#0f0f0f", border:"1px solid #252525", borderRadius:18,
          maxWidth:680, width:"100%", overflow:"hidden", boxShadow:"0 40px 80px rgba(0,0,0,0.8)",
          animation:"modalIn 0.25s ease" }}>
        <div style={{ display:"flex" }}>
          {/* Poster */}
          <div style={{ width:220, flexShrink:0 }}>
            <img src={movie.poster} alt={movie.title}
              style={{ width:"100%", height:"100%", objectFit:"cover", minHeight:340 }}
              onError={e => { e.target.src = `https://placehold.co/220x340/1a1a1a/F5C518?text=${encodeURIComponent(movie.title)}`; }} />
          </div>

          {/* Details */}
          <div style={{ flex:1, padding:"24px 24px 20px", display:"flex", flexDirection:"column" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
              <h2 style={{ margin:0, color:"#fff", fontFamily:"'Anton',sans-serif", fontSize:26, lineHeight:1.1 }}>{movie.title}</h2>
              <button onClick={onClose}
                style={{ background:"none", border:"1px solid #2a2a2a", color:"#666", cursor:"pointer",
                  borderRadius:"50%", width:30, height:30, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>✕</button>
            </div>

            <div style={{ display:"flex", gap:9, alignItems:"center", marginBottom:8 }}>
              <span style={{ color:"#F5C518", fontFamily:"'Space Mono',monospace", fontSize:11 }}>{movie.year}</span>
              <span style={{ color:"#333" }}>•</span>
              <span style={{ color:"#777", fontSize:10, fontFamily:"'Space Mono',monospace" }}>{movie.runtime}</span>
              <span style={{ color:"#333" }}>•</span>
              <span style={{ background:"#1a1a1a", border:"1px solid #333", borderRadius:3,
                padding:"1px 6px", fontSize:9, color:"#999", fontFamily:"'Space Mono',monospace" }}>{movie.rating}</span>
            </div>

            {/* Genre tags */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
              {(movie.genre || []).map(g => (
                <span key={g} style={{ background:"#1a1a1a", border:"1px solid #F5C51840",
                  color:"#F5C518", borderRadius:20, padding:"2px 9px", fontSize:9, fontFamily:"'Space Mono',monospace" }}>{g}</span>
              ))}
            </div>

            {/* IMDb score */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <ImdbBadge score={movie.imdb} />
              <StarRating score={movie.imdb} />
              <span style={{ color:"#F5C518", fontFamily:"'Anton',sans-serif", fontSize:20 }}>{movie.imdb}</span>
              <span style={{ color:"#333", fontSize:11 }}>/10</span>
            </div>

            {/* Review */}
            <div style={{ borderTop:"1px solid #1a1a1a", paddingTop:14, flex:1 }}>
              <p style={{ color:"#555", fontSize:9, fontFamily:"'Space Mono',monospace", letterSpacing:1, marginBottom:7 }}>REVIEW</p>
              <p style={{ color:"#ccc", fontFamily:"'Lora',serif", fontSize:12.5, lineHeight:1.75, fontStyle:"italic", margin:"0 0 10px" }}>"{movie.review}"</p>
              <p style={{ color:"#444", fontSize:10, fontFamily:"'Space Mono',monospace" }}>— {movie.reviewer}</p>
            </div>

            {/* Director */}
            <div style={{ borderTop:"1px solid #1a1a1a", paddingTop:12, marginTop:"auto" }}>
              <p style={{ color:"#444", fontSize:9, fontFamily:"'Space Mono',monospace", letterSpacing:1, margin:"0 0 3px" }}>DIRECTOR</p>
              <p style={{ color:"#bbb", fontSize:13, fontFamily:"'Lora',serif", margin:0 }}>{movie.director}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────
// Wrap everything in ErrorBoundary so even a total crash shows demo data
export default function Root() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

function App() {
  const [movies,        setMovies]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [dataSource,    setDataSource]    = useState("loading"); // "live" | "demo" | "loading"
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedYear,  setSelectedYear]  = useState("All");
  const [selectedRating,setSelectedRating]= useState("All");
  const [search,        setSearch]        = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [heroIndex,     setHeroIndex]     = useState(0);
  const [sidebarOpen,   setSidebarOpen]   = useState(true);

  // ── Connect to Firebase, with multi-layer fallback ─────────────────
  useEffect(() => {
    let unsubscribe  = null;
    let settled      = false;   // prevent double-setMovies

    // Safety net: if NOTHING has responded in 10 seconds, load demo data
    const hardTimeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        setMovies(FALLBACK_MOVIES);
        setDataSource("demo");
        setLoading(false);
      }
    }, 10_000);

    const useFallback = () => {
      if (settled) return;
      settled = true;
      clearTimeout(hardTimeout);
      setMovies(FALLBACK_MOVIES);
      setDataSource("demo");
      setLoading(false);
    };

    (async () => {
      try {
        const fb = await getFirebase();

        if (!fb) {
          // Config is placeholder OR Firebase SDK failed to load
          useFallback();
          return;
        }

        // Real-time listener — updates instantly when you add/edit in Firebase Console
        unsubscribe = fb.onSnapshot(
          fb.collection(fb.fs, "movies"),
          snapshot => {
            clearTimeout(hardTimeout);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (data.length) {
              settled = true;
              setMovies(data);
              setDataSource("live");
            } else {
              // Collection exists but is empty → show demo data
              useFallback();
            }
            setLoading(false);
          },
          _err => {
            // Firestore permission denied, network error, etc.
            useFallback();
          }
        );
      } catch {
        useFallback();
      }
    })();

    return () => {
      clearTimeout(hardTimeout);
      unsubscribe && unsubscribe();
    };
  }, []);

  // ── Hero auto-rotate every 6 s ─────────────────────────────────────
  const featured = movies.filter(m => m.featured);
  useEffect(() => {
    if (!featured.length) return;
    const t = setInterval(() => setHeroIndex(i => (i + 1) % featured.length), 6000);
    return () => clearInterval(t);
  }, [featured.length]);

  // ── Derive sidebar filter options from live data ───────────────────
  const genres = ["All", ...Array.from(new Set(movies.flatMap(m => m.genre || []))).sort()];
  const years  = ["All", ...Array.from(new Set(movies.map(m => String(m.year)))).sort((a, b) => b - a)];

  // ── Filter logic ───────────────────────────────────────────────────
  const filtered = movies.filter(m => {
    if (selectedGenre !== "All" && !(m.genre || []).includes(selectedGenre)) return false;
    if (selectedYear  !== "All" && String(m.year) !== selectedYear)          return false;
    if (selectedRating !== "All") {
      const min = parseFloat(selectedRating);
      if (m.imdb < min) return false;
    }
    const q = search.toLowerCase();
    if (q && !m.title?.toLowerCase().includes(q) && !m.director?.toLowerCase().includes(q)) return false;
    return true;
  });

  const SideItem = ({ label, active, onClick }) => (
    <div onClick={onClick} style={{
      padding:"6px 10px", borderRadius:5, cursor:"pointer", marginBottom:2,
      background:   active ? "#F5C51812" : "transparent",
      borderLeft:   active ? "2px solid #F5C518" : "2px solid transparent",
      color:        active ? "#F5C518" : "#666",
      fontSize:10, fontFamily:"'Space Mono',monospace", transition:"all 0.15s",
    }}>{label}</div>
  );

  const clearFilters = () => { setSelectedGenre("All"); setSelectedYear("All"); setSelectedRating("All"); setSearch(""); };
  const hasFilters   = selectedGenre !== "All" || selectedYear !== "All" || selectedRating !== "All" || search;

  return (
    <div style={{ minHeight:"100vh", background:"#080808", color:"#fff" }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Lora:ital,wght@0,400;1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* ── Global styles ───────────────────────────────────────────── */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
        @keyframes shimmer {
          0%   { opacity: 0.35; }
          50%  { opacity: 0.65; }
          100% { opacity: 0.35; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
      `}</style>

      {/* ── NAVBAR ──────────────────────────────────────────────────── */}
      <nav style={{
        position:"sticky", top:0, zIndex:100,
        background:"rgba(8,8,8,0.96)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid #161616",
        padding:"0 20px", height:60,
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:16,
      }}>
        {/* Logo + hamburger */}
        <div style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <button onClick={() => setSidebarOpen(o => !o)}
            style={{ background:"none", border:"none", color:"#F5C518", cursor:"pointer", fontSize:19, lineHeight:1 }}>☰</button>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <div style={{ width:26, height:26, background:"#F5C518", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🎬</div>
            <span style={{ fontFamily:"'Anton',sans-serif", fontSize:20, letterSpacing:2, color:"#fff" }}>
              CINE<span style={{ color:"#F5C518" }}>CRITIC</span>
            </span>
          </div>
        </div>

        {/* Search bar */}
        <div style={{ display:"flex", gap:7, background:"#111", border:"1px solid #1e1e1e",
          borderRadius:8, padding:"6px 12px", alignItems:"center", flex:1, maxWidth:300 }}>
          <span style={{ color:"#444", fontSize:14 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search movies, directors..."
            style={{ background:"none", border:"none", outline:"none", color:"#ccc",
              fontFamily:"'Space Mono',monospace", fontSize:10, width:"100%" }}
          />
          {search && (
            <span onClick={() => setSearch("")} style={{ color:"#444", cursor:"pointer", fontSize:12 }}>✕</span>
          )}
        </div>

        {/* Nav links */}
        <div style={{ display:"flex", gap:20, alignItems:"center", flexShrink:0 }}>
          {["Home", "Top Rated", "New Releases"].map(n => (
            <span key={n} style={{ color: n === "Home" ? "#F5C518" : "#666", fontSize:10, cursor:"pointer", fontFamily:"'Space Mono',monospace" }}>{n}</span>
          ))}
          {/* Live / Demo indicator */}
          {dataSource !== "loading" && (
            <div style={{
              display:"flex", alignItems:"center", gap:5,
              background: dataSource === "live" ? "#0a1f0a" : "#1a1200",
              border: `1px solid ${dataSource === "live" ? "#2d6a2d" : "#F5C51860"}`,
              borderRadius:6, padding:"4px 10px",
            }}>
              <div style={{
                width:6, height:6, borderRadius:"50%",
                background: dataSource === "live" ? "#4caf50" : "#F5C518",
                animation: dataSource === "live" ? "livePulse 2s infinite" : "none",
              }} />
              <span style={{
                color: dataSource === "live" ? "#4caf50" : "#F5C518",
                fontSize:9, fontFamily:"'Space Mono',monospace",
              }}>
                {dataSource === "live" ? "LIVE" : "DEMO"}
              </span>
            </div>
          )}
        </div>
      </nav>

      {/* ── BODY (sidebar + main) ────────────────────────────────────── */}
      <div style={{ display:"flex" }}>

        {/* SIDEBAR */}
        <aside style={{
          width: sidebarOpen ? 200 : 0, flexShrink:0,
          overflow:"hidden", transition:"width 0.3s ease",
          background:"#0b0b0b", borderRight:"1px solid #141414",
          minHeight:"calc(100vh - 60px)",
          padding: sidebarOpen ? "22px 14px" : 0,
        }}>
          {sidebarOpen && (
            <>
              {/* Genre */}
              <div style={{ marginBottom:24 }}>
                <p style={{ color:"#333", fontSize:8, letterSpacing:2, fontFamily:"'Space Mono',monospace", marginBottom:8 }}>GENRE</p>
                {genres.map(g => <SideItem key={g} label={g} active={selectedGenre === g} onClick={() => setSelectedGenre(g)} />)}
              </div>

              {/* Year */}
              <div style={{ marginBottom:24 }}>
                <p style={{ color:"#333", fontSize:8, letterSpacing:2, fontFamily:"'Space Mono',monospace", marginBottom:8 }}>YEAR</p>
                {years.map(y => <SideItem key={y} label={y} active={selectedYear === y} onClick={() => setSelectedYear(y)} />)}
              </div>

              {/* IMDb rating */}
              <div>
                <p style={{ color:"#333", fontSize:8, letterSpacing:2, fontFamily:"'Space Mono',monospace", marginBottom:8 }}>IMDb RATING</p>
                {RATINGS_FILTER.map(r => (
                  <SideItem key={r} label={r === "All" ? "All Ratings" : `⭐ ${r}`}
                    active={selectedRating === r} onClick={() => setSelectedRating(r)} />
                ))}
              </div>
            </>
          )}
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex:1, padding:"24px 24px 48px", minWidth:0, animation:"fadeIn 0.4s ease" }}>

          {/* Hero banner */}
          {!loading && featured.length > 0 && (
            <HeroBanner movie={featured[heroIndex % featured.length]} onClick={setSelectedMovie} />
          )}

          {/* Demo mode banner — shown when Firebase is not connected */}
          {!loading && dataSource === "demo" && (
            <div style={{
              display:"flex", alignItems:"center", gap:10,
              background:"#110e00", border:"1px solid #F5C51840",
              borderRadius:8, padding:"9px 14px", marginBottom:18,
            }}>
              <span style={{ fontSize:15 }}>⚡</span>
              <div style={{ flex:1 }}>
                <span style={{ color:"#F5C518", fontFamily:"'Space Mono',monospace", fontSize:10, fontWeight:700 }}>
                  DEMO MODE
                </span>
                <span style={{ color:"#888", fontFamily:"'Space Mono',monospace", fontSize:10, marginLeft:10 }}>
                  Showing sample data. Connect Firebase to load your real reviews.
                </span>
              </div>
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noreferrer"
                style={{ color:"#F5C518", fontFamily:"'Space Mono',monospace", fontSize:9,
                  background:"#F5C51815", border:"1px solid #F5C51840",
                  borderRadius:5, padding:"4px 10px", textDecoration:"none", flexShrink:0 }}>
                Setup Firebase →
              </a>
            </div>
          )}

          {/* Section header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <div>
              <h2 style={{ fontFamily:"'Anton',sans-serif", fontSize:20, letterSpacing:1, color:"#fff" }}>
                {selectedGenre !== "All" ? selectedGenre.toUpperCase() : "ALL MOVIES"}
                {search && <span style={{ color:"#F5C518" }}> · "{search}"</span>}
              </h2>
              {!loading && (
                <p style={{ color:"#444", fontSize:9, fontFamily:"'Space Mono',monospace", marginTop:3 }}>
                  {filtered.length} {filtered.length === 1 ? "title" : "titles"}
                </p>
              )}
            </div>
            {hasFilters && (
              <button onClick={clearFilters}
                style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#888",
                  padding:"6px 12px", borderRadius:6, cursor:"pointer", fontSize:9, fontFamily:"'Space Mono',monospace" }}>
                Clear filters ✕
              </button>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            // Skeleton loaders while fetching
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(165px,1fr))", gap:16 }}>
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"70px 0", color:"#333" }}>
              <div style={{ fontSize:44, marginBottom:14 }}>🎬</div>
              <p style={{ fontFamily:"'Lora',serif", fontSize:15 }}>No movies match your filters.</p>
              {hasFilters && (
                <button onClick={clearFilters}
                  style={{ marginTop:16, background:"#F5C518", border:"none", color:"#000",
                    padding:"8px 20px", borderRadius:8, cursor:"pointer", fontFamily:"'Anton',sans-serif", fontSize:13, letterSpacing:1 }}>
                  CLEAR FILTERS
                </button>
              )}
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(165px,1fr))", gap:16 }}>
              {filtered.map(m => <MovieCard key={m.id} movie={m} onClick={setSelectedMovie} />)}
            </div>
          )}
        </main>
      </div>

      {/* DETAIL MODAL */}
      {selectedMovie && <Modal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid #0f0f0f", padding:"20px 26px",
        display:"flex", justifyContent:"space-between", alignItems:"center", background:"#050505" }}>
        <span style={{ fontFamily:"'Anton',sans-serif", fontSize:14, letterSpacing:2 }}>
          CINE<span style={{ color:"#F5C518" }}>CRITIC</span>
          <span style={{ color:"#252525", fontFamily:"'Space Mono',monospace", fontSize:9, marginLeft:10 }}>© 2025</span>
        </span>
        <p style={{ color:"#252525", fontSize:9, fontFamily:"'Space Mono',monospace" }}>
          Powered by Firebase · Hosted on Vercel
        </p>
      </footer>
    </div>
  );
}
