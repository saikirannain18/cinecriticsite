import { useState, useEffect, Component } from "react";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDi9KTtfyOHY8McVA1ObzloNOekGY_tgfI",
  authDomain: "cinecriticdb.firebaseapp.com",
  projectId: "cinecriticdb",
  storageBucket: "cinecriticdb.firebasestorage.app",
  messagingSenderId: "855382839651",
  appId: "1:855382839651:web:e9fa724bd796e7af258356"
};

const FALLBACK_MOVIES = [
  { id: "1",  title: "Oppenheimer",                       year: 2023, genre: ["Drama", "History"],     imdb: 8.9, director: "Christopher Nolan",   poster: "https://image.tmdb.org/t/p/w500/8Gxv8giaFIzmZTKykFCdna8FAUh.jpg",  review: "A stunning, profound portrait of the man who split the world apart. Nolan's magnum opus delivers unparalleled tension and breathtaking cinematography.",  reviewer: "Alex Turner", featured: true,  rating: "R",     runtime: "180 min" },
  { id: "2",  title: "Dune: Part Two",                    year: 2024, genre: ["Sci-Fi", "Adventure"],  imdb: 8.5, director: "Denis Villeneuve",     poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",  review: "Epic in every sense. Villeneuve completes his vision with jaw-dropping scale and performances that haunt you long after the credits roll.",             reviewer: "Alex Turner", featured: true,  rating: "PG-13", runtime: "166 min" },
  { id: "3",  title: "The Batman",                        year: 2022, genre: ["Action", "Crime"],      imdb: 7.8, director: "Matt Reeves",          poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",  review: "Dark, brooding and methodical. Reeves reinvents the Caped Crusader as a noir detective. Pattinson is revelatory.",                                    reviewer: "Alex Turner", featured: false, rating: "PG-13", runtime: "176 min" },
  { id: "4",  title: "Parasite",                          year: 2019, genre: ["Thriller", "Drama"],    imdb: 8.5, director: "Bong Joon-ho",         poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",  review: "A perfectly constructed social thriller that shifts genre like a snake shedding skin. Unmissable cinema.",                                            reviewer: "Alex Turner", featured: false, rating: "R",     runtime: "132 min" },
  { id: "5",  title: "The Godfather",                     year: 1972, genre: ["Crime", "Drama"],       imdb: 9.2, director: "Francis Ford Coppola", poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLeBMapLGMGw.jpg",  review: "The pinnacle of American cinema. Coppola's epic remains the benchmark against which all crime films are measured.",                                    reviewer: "Alex Turner", featured: true,  rating: "R",     runtime: "175 min" },
  { id: "6",  title: "Interstellar",                      year: 2014, genre: ["Sci-Fi", "Adventure"],  imdb: 8.7, director: "Christopher Nolan",   poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIE.jpg",  review: "A transcendent journey across space and time. Nolan blends hard science with raw parental love to create one of cinema's most ambitious achievements.", reviewer: "Alex Turner", featured: false, rating: "PG-13", runtime: "169 min" },
  { id: "7",  title: "Inception",                         year: 2010, genre: ["Action", "Sci-Fi"],     imdb: 8.8, director: "Christopher Nolan",   poster: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",  review: "A labyrinthine puzzle wrapped in a blockbuster. Nolan makes the impossible feel visceral and emotionally resonant through sheer filmmaking bravado.",   reviewer: "Alex Turner", featured: false, rating: "PG-13", runtime: "148 min" },
  { id: "8",  title: "Whiplash",                          year: 2014, genre: ["Drama", "Music"],       imdb: 8.5, director: "Damien Chazelle",      poster: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",  review: "The most visceral film about artistic obsession ever made. Chazelle and Simmons turn a music drama into a psychological war. Pure adrenaline.",         reviewer: "Alex Turner", featured: false, rating: "R",     runtime: "107 min" },
  { id: "9",  title: "Everything Everywhere All at Once", year: 2022, genre: ["Comedy", "Sci-Fi"],     imdb: 7.8, director: "Daniel Kwan",          poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",  review: "Audacious, chaotic, and unexpectedly moving. The Daniels craft a multiverse epic about love and identity with astonishing emotional depth.",             reviewer: "Alex Turner", featured: false, rating: "R",     runtime: "139 min" },
  { id: "10", title: "Mad Max: Fury Road",                year: 2015, genre: ["Action", "Adventure"],  imdb: 8.1, director: "George Miller",        poster: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",  review: "Two hours of relentless operatic stunt-driven cinema. Miller's return is a lesson in pure action filmmaking that puts modern blockbusters to shame.",   reviewer: "Alex Turner", featured: false, rating: "R",     runtime: "120 min" },
  { id: "11", title: "Joker",                             year: 2019, genre: ["Crime", "Drama"],       imdb: 8.4, director: "Todd Phillips",        poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",  review: "Phoenix transforms himself completely. A deeply uncomfortable character study that dares to make a monster sympathetic.",                               reviewer: "Alex Turner", featured: false, rating: "R",     runtime: "122 min" },
  { id: "12", title: "The Dark Knight",                   year: 2008, genre: ["Action", "Crime"],      imdb: 9.0, director: "Christopher Nolan",   poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",  review: "Ledger's Joker is one of cinema's greatest villains. Nolan elevates superhero storytelling into genuine moral tragedy. A masterpiece.",                  reviewer: "Alex Turner", featured: true,  rating: "PG-13", runtime: "152 min" },
];

const RATINGS_FILTER = ["All", "9+", "8.5+", "8+", "7.5+"];

// ── FIREBASE ─────────────────────────────────────────────────────────
function isPlaceholderConfig() {
  return !FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === "YOUR_API_KEY" || FIREBASE_CONFIG.projectId === "YOUR_PROJECT_ID" || FIREBASE_CONFIG.projectId === "";
}
let _firebase = null;
function withTimeout(promise, ms) {
  return Promise.race([promise, new Promise((_, r) => setTimeout(() => r(new Error("timeout")), ms))]);
}
async function getFirebase() {
  if (_firebase) return _firebase;
  if (isPlaceholderConfig()) return null;
  try {
    const [{ initializeApp, getApps }, { getFirestore, collection, onSnapshot }] = await withTimeout(
      Promise.all([
        import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"),
      ]), 8000
    );
    const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
    _firebase = { fs: getFirestore(app), collection, onSnapshot };
    return _firebase;
  } catch { return null; }
}

// ── ERROR BOUNDARY ────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { crashed: false }; }
  static getDerivedStateFromError() { return { crashed: true }; }
  render() { return this.state.crashed ? <FallbackApp /> : this.props.children; }
}

function FallbackApp() {
  const [sel, setSel] = useState(null);
  return (
    <div style={{ minHeight:"100vh", background:"#080808", color:"#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Lora:ital,wght@0,400;1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <nav style={{ background:"#0d0d0d", borderBottom:"1px solid #1a1a1a", padding:"0 16px", height:56, display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:24, height:24, background:"#F5C518", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12 }}>🎬</div>
        <span style={{ fontFamily:"'Anton',sans-serif", fontSize:18, letterSpacing:2 }}>CINE<span style={{ color:"#F5C518" }}>CRITIC</span></span>
        <span style={{ marginLeft:"auto", background:"#1a1200", border:"1px solid #F5C51860", color:"#F5C518", fontSize:9, fontFamily:"'Space Mono',monospace", padding:"3px 8px", borderRadius:5 }}>● DEMO</span>
      </nav>
      <main style={{ padding:"16px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:12 }}>
          {FALLBACK_MOVIES.map(m => (
            <div key={m.id} onClick={() => setSel(m)} style={{ cursor:"pointer", borderRadius:10, overflow:"hidden", background:"#141414", border:"1px solid #222" }}>
              <img src={m.poster} alt={m.title} style={{ width:"100%", aspectRatio:"2/3", objectFit:"cover" }} onError={e => { e.target.src=`https://placehold.co/300x450/1a1a1a/F5C518?text=${encodeURIComponent(m.title)}`; }} />
              <div style={{ padding:"8px 10px" }}>
                <p style={{ fontFamily:"'Anton',sans-serif", fontSize:12, color:"#fff", margin:"0 0 2px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m.title}</p>
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:"#F5C518" }}>{m.year}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      {sel && <MovieModal movie={sel} onClose={() => setSel(null)} />}
    </div>
  );
}

// ── SHARED COMPONENTS ─────────────────────────────────────────────────
const StarRating = ({ score, small }) => {
  const filled = Math.round(score / 2);
  const size = small ? 10 : 12;
  return (
    <div style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill={s<=filled?"#F5C518":"none"} stroke="#F5C518" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
};

const ImdbBadge = ({ score, small }) => (
  <div style={{ display:"flex", alignItems:"center", gap:4, background:"#F5C518", borderRadius:4, padding: small ? "1px 5px" : "2px 7px" }}>
    <span style={{ fontFamily:"'Anton',sans-serif", fontSize: small ? 7 : 9, color:"#000", letterSpacing:1 }}>IMDb</span>
    <span style={{ fontFamily:"'Anton',sans-serif", fontSize: small ? 10 : 12, color:"#000", fontWeight:700 }}>{score}</span>
  </div>
);

const SkeletonCard = () => (
  <div style={{ borderRadius:10, overflow:"hidden", background:"#141414", border:"1px solid #1e1e1e" }}>
    <div style={{ aspectRatio:"2/3", background:"#1e1e1e", animation:"shimmer 1.4s ease-in-out infinite" }} />
    <div style={{ padding:"10px 12px" }}>
      <div style={{ height:12, background:"#1e1e1e", borderRadius:4, marginBottom:7, animation:"shimmer 1.4s ease-in-out infinite" }} />
      <div style={{ height:9, background:"#1a1a1a", borderRadius:4, width:"55%", animation:"shimmer 1.4s ease-in-out infinite" }} />
    </div>
  </div>
);

// ── MOVIE CARD ────────────────────────────────────────────────────────
const MovieCard = ({ movie, onClick, isMobile }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      onClick={() => onClick(movie)}
      style={{
        borderRadius:10, overflow:"hidden", background:"#141414", cursor:"pointer",
        border:     hovered ? "1px solid #F5C518" : "1px solid #1e1e1e",
        transform:  hovered ? "translateY(-4px)" : "none",
        transition: "all 0.25s ease",
        boxShadow:  hovered ? "0 16px 36px rgba(245,197,24,0.18)" : "0 2px 10px rgba(0,0,0,0.4)",
      }}>
      <div style={{ position:"relative", aspectRatio:"2/3", overflow:"hidden" }}>
        <img src={movie.poster} alt={movie.title}
          style={{ width:"100%", height:"100%", objectFit:"cover", transform: hovered ? "scale(1.06)" : "scale(1)", transition:"transform 0.35s ease" }}
          onError={e => { e.target.src=`https://placehold.co/300x450/1a1a1a/F5C518?text=${encodeURIComponent(movie.title)}`; }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)" }} />
        <div style={{ position:"absolute", top:6, right:6 }}><ImdbBadge score={movie.imdb} small /></div>
        {movie.featured && (
          <div style={{ position:"absolute", top:6, left:6, background:"#F5C518", borderRadius:3, padding:"1px 5px" }}>
            <span style={{ fontFamily:"'Anton',sans-serif", fontSize:7, color:"#000", letterSpacing:1 }}>FEATURED</span>
          </div>
        )}
      </div>
      <div style={{ padding:"9px 11px 10px" }}>
        <h3 style={{ margin:"0 0 3px", color:"#fff", fontSize: isMobile ? 12 : 13, fontFamily:"'Anton',sans-serif", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{movie.title}</h3>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
          <span style={{ color:"#F5C518", fontSize:9, fontFamily:"'Space Mono',monospace" }}>{movie.year}</span>
          <span style={{ color:"#555", fontSize:8, fontFamily:"'Space Mono',monospace" }}>{movie.runtime}</span>
        </div>
        <StarRating score={movie.imdb} small />
        <div style={{ marginTop:5, display:"flex", flexWrap:"wrap", gap:3 }}>
          {(movie.genre||[]).slice(0,2).map(g => (
            <span key={g} style={{ background:"#1e1e1e", border:"1px solid #2a2a2a", borderRadius:20, padding:"1px 6px", fontSize:7, color:"#888", fontFamily:"'Space Mono',monospace" }}>{g}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── HERO BANNER ───────────────────────────────────────────────────────
const HeroBanner = ({ movie, onClick, isMobile }) => {
  const [hov, setHov] = useState(false);
  if (!movie) return null;
  return (
    <div onClick={() => onClick(movie)} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        position:"relative", borderRadius: isMobile ? 12 : 16, overflow:"hidden", cursor:"pointer",
        marginBottom: isMobile ? 16 : 24, height: isMobile ? 220 : 340,
        boxShadow: hov ? "0 24px 48px rgba(245,197,24,0.15)" : "0 8px 32px rgba(0,0,0,0.6)",
        transition:"box-shadow 0.3s ease",
      }}>
      <img src={movie.poster} alt={movie.title}
        style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top",
          filter:"brightness(0.35)", transform: hov ? "scale(1.03)" : "scale(1)", transition:"transform 0.5s ease" }}
        onError={e => { e.target.src=`https://placehold.co/800x340/0a0a0a/F5C518?text=${encodeURIComponent(movie.title)}`; }} />
      <div style={{ position:"absolute", inset:0, background: isMobile
        ? "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)"
        : "linear-gradient(110deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.44) 55%, transparent 100%)" }} />
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", justifyContent:"flex-end", padding: isMobile ? "16px 14px" : "28px 32px" }}>
        <div style={{ display:"flex", gap:8, marginBottom: isMobile ? 5 : 8, alignItems:"center" }}>
          <span style={{ background:"#F5C518", color:"#000", fontSize: isMobile ? 7 : 9, fontFamily:"'Anton',sans-serif", letterSpacing:2, padding: isMobile ? "2px 6px" : "3px 9px", borderRadius:3 }}>FEATURED</span>
          <ImdbBadge score={movie.imdb} small={isMobile} />
        </div>
        <h2 style={{ margin:"0 0 4px", color:"#fff", fontSize: isMobile ? 22 : 36, fontFamily:"'Anton',sans-serif", letterSpacing:1, lineHeight:1 }}>{movie.title}</h2>
        <div style={{ display:"flex", gap:10, marginBottom: isMobile ? 6 : 10, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ color:"#F5C518", fontFamily:"'Space Mono',monospace", fontSize: isMobile ? 9 : 11 }}>{movie.year}</span>
          <span style={{ color:"#444" }}>•</span>
          <span style={{ color:"#999", fontSize: isMobile ? 9 : 10, fontFamily:"'Space Mono',monospace" }}>Dir. {movie.director}</span>
          {!isMobile && <><span style={{ color:"#444" }}>•</span><span style={{ color:"#999", fontSize:10, fontFamily:"'Space Mono',monospace" }}>{movie.runtime}</span></>}
        </div>
        {!isMobile && <p style={{ color:"#ccc", fontFamily:"'Lora',serif", fontSize:13, lineHeight:1.65, maxWidth:520, margin:"0 0 10px", fontStyle:"italic" }}>"{movie.review}"</p>}
        {isMobile && <p style={{ color:"#ccc", fontFamily:"'Lora',serif", fontSize:11, lineHeight:1.5, margin:"0 0 6px", fontStyle:"italic", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>"{movie.review}"</p>}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <StarRating score={movie.imdb} small={isMobile} />
          <span style={{ color:"#555", fontFamily:"'Space Mono',monospace", fontSize: isMobile ? 9 : 10 }}>— {movie.reviewer}</span>
        </div>
      </div>
    </div>
  );
};

// ── MOVIE DETAIL MODAL ────────────────────────────────────────────────
const MovieModal = ({ movie, onClose, isMobile }) => {
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    // prevent body scroll when modal open
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, []);
  if (!movie) return null;

  // MOBILE: full screen bottom sheet style
  if (isMobile) return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:2000, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"flex-end", backdropFilter:"blur(8px)" }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background:"#0f0f0f", border:"1px solid #222", borderRadius:"18px 18px 0 0", width:"100%", maxHeight:"90vh", overflowY:"auto", animation:"slideUp 0.3s ease" }}>
        {/* Drag handle */}
        <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 0" }}>
          <div style={{ width:36, height:4, background:"#333", borderRadius:2 }} />
        </div>
        {/* Top section: poster + basic info */}
        <div style={{ display:"flex", gap:14, padding:"14px 16px 0" }}>
          <img src={movie.poster} alt={movie.title} style={{ width:100, borderRadius:10, objectFit:"cover", flexShrink:0 }}
            onError={e => { e.target.src=`https://placehold.co/100x150/1a1a1a/F5C518?text=?`; }} />
          <div style={{ flex:1, minWidth:0 }}>
            <h2 style={{ margin:"0 0 5px", color:"#fff", fontFamily:"'Anton',sans-serif", fontSize:20, lineHeight:1.1 }}>{movie.title}</h2>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:7, flexWrap:"wrap" }}>
              <span style={{ color:"#F5C518", fontFamily:"'Space Mono',monospace", fontSize:10 }}>{movie.year}</span>
              <span style={{ color:"#333" }}>•</span>
              <span style={{ color:"#777", fontSize:10 }}>{movie.runtime}</span>
              <span style={{ background:"#1a1a1a", border:"1px solid #333", borderRadius:3, padding:"1px 5px", fontSize:8, color:"#999" }}>{movie.rating}</span>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
              {(movie.genre||[]).map(g => <span key={g} style={{ background:"#1a1a1a", border:"1px solid #F5C51840", color:"#F5C518", borderRadius:20, padding:"2px 8px", fontSize:8, fontFamily:"'Space Mono',monospace" }}>{g}</span>)}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <ImdbBadge score={movie.imdb} small />
              <StarRating score={movie.imdb} small />
            </div>
          </div>
        </div>
        {/* Review */}
        <div style={{ padding:"16px 16px 32px" }}>
          <p style={{ color:"#555", fontSize:8, fontFamily:"'Space Mono',monospace", letterSpacing:1, margin:"0 0 8px" }}>REVIEW</p>
          <p style={{ color:"#ccc", fontFamily:"'Lora',serif", fontSize:13, lineHeight:1.75, fontStyle:"italic", margin:"0 0 10px" }}>"{movie.review}"</p>
          <p style={{ color:"#444", fontSize:10, fontFamily:"'Space Mono',monospace", margin:"0 0 16px" }}>— {movie.reviewer}</p>
          <div style={{ borderTop:"1px solid #1a1a1a", paddingTop:12 }}>
            <p style={{ color:"#444", fontSize:8, fontFamily:"'Space Mono',monospace", letterSpacing:1, margin:"0 0 3px" }}>DIRECTOR</p>
            <p style={{ color:"#bbb", fontSize:13, fontFamily:"'Lora',serif", margin:0 }}>{movie.director}</p>
          </div>
          <button onClick={onClose} style={{ marginTop:20, width:"100%", background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#888", padding:"12px 0", borderRadius:10, cursor:"pointer", fontFamily:"'Space Mono',monospace", fontSize:11 }}>Close</button>
        </div>
      </div>
    </div>
  );

  // DESKTOP: centered modal
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:2000, background:"rgba(0,0,0,0.88)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, backdropFilter:"blur(10px)" }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background:"#0f0f0f", border:"1px solid #252525", borderRadius:18, maxWidth:680, width:"100%", overflow:"hidden", boxShadow:"0 40px 80px rgba(0,0,0,0.8)", animation:"modalIn 0.25s ease" }}>
        <div style={{ display:"flex" }}>
          <div style={{ width:220, flexShrink:0 }}>
            <img src={movie.poster} alt={movie.title} style={{ width:"100%", height:"100%", objectFit:"cover", minHeight:340 }}
              onError={e => { e.target.src=`https://placehold.co/220x340/1a1a1a/F5C518?text=${encodeURIComponent(movie.title)}`; }} />
          </div>
          <div style={{ flex:1, padding:"24px 24px 20px", display:"flex", flexDirection:"column" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
              <h2 style={{ margin:0, color:"#fff", fontFamily:"'Anton',sans-serif", fontSize:26, lineHeight:1.1 }}>{movie.title}</h2>
              <button onClick={onClose} style={{ background:"none", border:"1px solid #2a2a2a", color:"#666", cursor:"pointer", borderRadius:"50%", width:30, height:30, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>✕</button>
            </div>
            <div style={{ display:"flex", gap:9, alignItems:"center", marginBottom:8 }}>
              <span style={{ color:"#F5C518", fontFamily:"'Space Mono',monospace", fontSize:11 }}>{movie.year}</span>
              <span style={{ color:"#333" }}>•</span>
              <span style={{ color:"#777", fontSize:10 }}>{movie.runtime}</span>
              <span style={{ color:"#333" }}>•</span>
              <span style={{ background:"#1a1a1a", border:"1px solid #333", borderRadius:3, padding:"1px 6px", fontSize:9, color:"#999" }}>{movie.rating}</span>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
              {(movie.genre||[]).map(g => <span key={g} style={{ background:"#1a1a1a", border:"1px solid #F5C51840", color:"#F5C518", borderRadius:20, padding:"2px 9px", fontSize:9, fontFamily:"'Space Mono',monospace" }}>{g}</span>)}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <ImdbBadge score={movie.imdb} />
              <StarRating score={movie.imdb} />
              <span style={{ color:"#F5C518", fontFamily:"'Anton',sans-serif", fontSize:20 }}>{movie.imdb}</span>
              <span style={{ color:"#333", fontSize:11 }}>/10</span>
            </div>
            <div style={{ borderTop:"1px solid #1a1a1a", paddingTop:14, flex:1 }}>
              <p style={{ color:"#555", fontSize:9, fontFamily:"'Space Mono',monospace", letterSpacing:1, marginBottom:7 }}>REVIEW</p>
              <p style={{ color:"#ccc", fontFamily:"'Lora',serif", fontSize:12.5, lineHeight:1.75, fontStyle:"italic", margin:"0 0 10px" }}>"{movie.review}"</p>
              <p style={{ color:"#444", fontSize:10, fontFamily:"'Space Mono',monospace" }}>— {movie.reviewer}</p>
            </div>
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

// ── FILTER DRAWER (mobile) ────────────────────────────────────────────
const FilterDrawer = ({ open, onClose, genres, years, selectedGenre, setSelectedGenre, selectedYear, setSelectedYear, selectedRating, setSelectedRating }) => {
  if (!open) return null;
  const SideItem = ({ label, active, onClick }) => (
    <div onClick={() => { onClick(); }} style={{ padding:"8px 12px", borderRadius:6, cursor:"pointer", marginBottom:2, background: active?"#F5C51815":"transparent", borderLeft: active?"2px solid #F5C518":"2px solid transparent", color: active?"#F5C518":"#888", fontSize:12, fontFamily:"'Space Mono',monospace" }}>{label}</div>
  );
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:1500, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ position:"absolute", left:0, top:0, bottom:0, width:240, background:"#0c0c0c", borderRight:"1px solid #1e1e1e", overflowY:"auto", animation:"slideRight 0.25s ease" }}>
        <div style={{ padding:"16px 14px", borderBottom:"1px solid #1a1a1a", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"'Anton',sans-serif", fontSize:16, letterSpacing:1, color:"#fff" }}>FILTERS</span>
          <button onClick={onClose} style={{ background:"none", border:"1px solid #2a2a2a", color:"#666", cursor:"pointer", borderRadius:"50%", width:28, height:28, fontSize:14 }}>✕</button>
        </div>
        <div style={{ padding:"16px 14px" }}>
          <p style={{ color:"#333", fontSize:8, letterSpacing:2, fontFamily:"'Space Mono',monospace", marginBottom:8 }}>GENRE</p>
          {genres.map(g => <SideItem key={g} label={g} active={selectedGenre===g} onClick={() => setSelectedGenre(g)} />)}
          <p style={{ color:"#333", fontSize:8, letterSpacing:2, fontFamily:"'Space Mono',monospace", margin:"20px 0 8px" }}>YEAR</p>
          {years.map(y => <SideItem key={y} label={y} active={selectedYear===y} onClick={() => setSelectedYear(y)} />)}
          <p style={{ color:"#333", fontSize:8, letterSpacing:2, fontFamily:"'Space Mono',monospace", margin:"20px 0 8px" }}>IMDb RATING</p>
          {RATINGS_FILTER.map(r => <SideItem key={r} label={r==="All"?"All Ratings":`⭐ ${r}`} active={selectedRating===r} onClick={() => setSelectedRating(r)} />)}
        </div>
        <div style={{ padding:"0 14px 24px" }}>
          <button onClick={onClose} style={{ width:"100%", background:"#F5C518", border:"none", color:"#000", padding:"12px 0", borderRadius:10, cursor:"pointer", fontFamily:"'Anton',sans-serif", fontSize:14, letterSpacing:1 }}>APPLY FILTERS</button>
        </div>
      </div>
    </div>
  );
};

// ── MAIN APP ──────────────────────────────────────────────────────────
export default function Root() {
  return <ErrorBoundary><App /></ErrorBoundary>;
}

function App() {
  const [movies,         setMovies]         = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [dataSource,     setDataSource]     = useState("loading");
  const [selectedGenre,  setSelectedGenre]  = useState("All");
  const [selectedYear,   setSelectedYear]   = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [search,         setSearch]         = useState("");
  const [selectedMovie,  setSelectedMovie]  = useState(null);
  const [heroIndex,      setHeroIndex]      = useState(0);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [filterDrawer,   setFilterDrawer]   = useState(false);
  const [searchOpen,     setSearchOpen]     = useState(false);

  // Detect mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // On desktop, sidebar starts open
  useEffect(() => { if (!isMobile) setSidebarOpen(true); else setSidebarOpen(false); }, [isMobile]);

  // Firebase
  useEffect(() => {
    let unsubscribe = null;
    let settled = false;
    const hardTimeout = setTimeout(() => {
      if (!settled) { settled=true; setMovies(FALLBACK_MOVIES); setDataSource("demo"); setLoading(false); }
    }, 10000);
    const useFallback = () => {
      if (settled) return;
      settled=true; clearTimeout(hardTimeout); setMovies(FALLBACK_MOVIES); setDataSource("demo"); setLoading(false);
    };
    (async () => {
      try {
        const fb = await getFirebase();
        if (!fb) { useFallback(); return; }
        unsubscribe = fb.onSnapshot(fb.collection(fb.fs,"movies"),
          snap => {
            clearTimeout(hardTimeout);
            const data = snap.docs.map(d => ({ id:d.id, ...d.data() }));
            if (data.length) { settled=true; setMovies(data); setDataSource("live"); }
            else useFallback();
            setLoading(false);
          },
          () => useFallback()
        );
      } catch { useFallback(); }
    })();
    return () => { clearTimeout(hardTimeout); unsubscribe&&unsubscribe(); };
  }, []);

  const featured = movies.filter(m => m.featured);
  useEffect(() => {
    if (!featured.length) return;
    const t = setInterval(() => setHeroIndex(i => (i+1)%featured.length), 6000);
    return () => clearInterval(t);
  }, [featured.length]);

  const genres  = ["All", ...Array.from(new Set(movies.flatMap(m=>m.genre||[]))).sort()];
  const years   = ["All", ...Array.from(new Set(movies.map(m=>String(m.year)))).sort((a,b)=>b-a)];

  const filtered = movies.filter(m => {
    if (selectedGenre!=="All" && !(m.genre||[]).includes(selectedGenre)) return false;
    if (selectedYear!=="All"  && String(m.year)!==selectedYear) return false;
    if (selectedRating!=="All") { if (m.imdb < parseFloat(selectedRating)) return false; }
    const q = search.toLowerCase();
    if (q && !m.title?.toLowerCase().includes(q) && !m.director?.toLowerCase().includes(q)) return false;
    return true;
  });

  const SideItem = ({ label, active, onClick }) => (
    <div onClick={onClick} style={{ padding:"6px 10px", borderRadius:5, cursor:"pointer", marginBottom:2, background:active?"#F5C51812":"transparent", borderLeft:active?"2px solid #F5C518":"2px solid transparent", color:active?"#F5C518":"#666", fontSize:10, fontFamily:"'Space Mono',monospace", transition:"all 0.15s" }}>{label}</div>
  );

  const clearFilters = () => { setSelectedGenre("All"); setSelectedYear("All"); setSelectedRating("All"); setSearch(""); };
  const hasFilters   = selectedGenre!=="All"||selectedYear!=="All"||selectedRating!=="All"||search;
  const activeFilterCount = [selectedGenre!=="All", selectedYear!=="All", selectedRating!=="All", !!search].filter(Boolean).length;

  return (
    <div style={{ minHeight:"100vh", background:"#080808", color:"#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Lora:ital,wght@0,400;1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:#0a0a0a; }
        ::-webkit-scrollbar-thumb { background:#222; border-radius:2px; }
        @keyframes shimmer { 0%{opacity:.35}50%{opacity:.65}100%{opacity:.35} }
        @keyframes modalIn { from{opacity:0;transform:translateY(16px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes slideRight { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:.35} }
      `}</style>

      {/* ── NAVBAR ──────────────────────────────────────────────────── */}
      <nav style={{
        position:"sticky", top:0, zIndex:200,
        background:"rgba(8,8,8,0.97)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid #161616",
        padding: isMobile ? "0 14px" : "0 20px",
        height: isMobile ? 54 : 60,
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:10,
      }}>
        {/* Left: hamburger + logo */}
        <div style={{ display:"flex", alignItems:"center", gap: isMobile ? 8 : 12, flexShrink:0 }}>
          {!isMobile && (
            <button onClick={() => setSidebarOpen(o=>!o)} style={{ background:"none", border:"none", color:"#F5C518", cursor:"pointer", fontSize:19 }}>☰</button>
          )}
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width: isMobile?22:26, height: isMobile?22:26, background:"#F5C518", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", fontSize: isMobile?11:14 }}>🎬</div>
            <span style={{ fontFamily:"'Anton',sans-serif", fontSize: isMobile?17:20, letterSpacing:2, color:"#fff" }}>CINE<span style={{ color:"#F5C518" }}>CRITIC</span></span>
          </div>
        </div>

        {/* Middle: search (desktop always visible, mobile toggle) */}
        {!isMobile ? (
          <div style={{ display:"flex", gap:7, background:"#111", border:"1px solid #1e1e1e", borderRadius:8, padding:"6px 12px", alignItems:"center", flex:1, maxWidth:300 }}>
            <span style={{ color:"#444", fontSize:14 }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search movies, directors..."
              style={{ background:"none", border:"none", outline:"none", color:"#ccc", fontFamily:"'Space Mono',monospace", fontSize:10, width:"100%" }} />
            {search && <span onClick={()=>setSearch("")} style={{ color:"#444", cursor:"pointer", fontSize:12 }}>✕</span>}
          </div>
        ) : searchOpen ? (
          <div style={{ display:"flex", gap:7, background:"#111", border:"1px solid #1e1e1e", borderRadius:8, padding:"6px 10px", alignItems:"center", flex:1 }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." autoFocus
              style={{ background:"none", border:"none", outline:"none", color:"#ccc", fontFamily:"'Space Mono',monospace", fontSize:11, width:"100%" }} />
            <span onClick={()=>{setSearch("");setSearchOpen(false);}} style={{ color:"#444", cursor:"pointer", fontSize:13 }}>✕</span>
          </div>
        ) : null}

        {/* Right */}
        <div style={{ display:"flex", gap: isMobile?8:16, alignItems:"center", flexShrink:0 }}>
          {isMobile ? (
            <>
              {!searchOpen && <button onClick={()=>setSearchOpen(true)} style={{ background:"none", border:"none", color:"#888", cursor:"pointer", fontSize:18, lineHeight:1 }}>🔍</button>}
              <button onClick={()=>setFilterDrawer(true)} style={{ background: activeFilterCount>0?"#F5C51820":"#111", border:`1px solid ${activeFilterCount>0?"#F5C51880":"#222"}`, color: activeFilterCount>0?"#F5C518":"#888", cursor:"pointer", borderRadius:8, padding:"6px 10px", fontSize:11, fontFamily:"'Space Mono',monospace", display:"flex", alignItems:"center", gap:5 }}>
                ⚙ {activeFilterCount>0 && <span style={{ background:"#F5C518", color:"#000", borderRadius:"50%", width:16, height:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700 }}>{activeFilterCount}</span>}
              </button>
            </>
          ) : (
            <>
              {["Home","Top Rated","New Releases"].map(n=>(
                <span key={n} style={{ color:n==="Home"?"#F5C518":"#666", fontSize:10, cursor:"pointer", fontFamily:"'Space Mono',monospace" }}>{n}</span>
              ))}
            </>
          )}
          {dataSource!=="loading" && (
            <div style={{ display:"flex", alignItems:"center", gap:4, background: dataSource==="live"?"#0a1f0a":"#1a1200", border:`1px solid ${dataSource==="live"?"#2d6a2d":"#F5C51860"}`, borderRadius:6, padding:"3px 8px" }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background: dataSource==="live"?"#4caf50":"#F5C518", animation: dataSource==="live"?"livePulse 2s infinite":"none" }} />
              <span style={{ color: dataSource==="live"?"#4caf50":"#F5C518", fontSize:8, fontFamily:"'Space Mono',monospace" }}>{dataSource==="live"?"LIVE":"DEMO"}</span>
            </div>
          )}
        </div>
      </nav>

      {/* ── MOBILE FILTER DRAWER ─────────────────────────────────────── */}
      <FilterDrawer open={filterDrawer} onClose={()=>setFilterDrawer(false)} genres={genres} years={years}
        selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre}
        selectedYear={selectedYear} setSelectedYear={setSelectedYear}
        selectedRating={selectedRating} setSelectedRating={setSelectedRating} />

      <div style={{ display:"flex" }}>

        {/* ── DESKTOP SIDEBAR ──────────────────────────────────────── */}
        {!isMobile && (
          <aside style={{ width:sidebarOpen?196:0, flexShrink:0, overflow:"hidden", transition:"width 0.3s ease", background:"#0b0b0b", borderRight:"1px solid #141414", minHeight:"calc(100vh - 60px)", padding:sidebarOpen?"20px 14px":0 }}>
            {sidebarOpen && <>
              <div style={{ marginBottom:22 }}>
                <p style={{ color:"#333", fontSize:8, letterSpacing:2, fontFamily:"'Space Mono',monospace", marginBottom:8 }}>GENRE</p>
                {genres.map(g=><SideItem key={g} label={g} active={selectedGenre===g} onClick={()=>setSelectedGenre(g)} />)}
              </div>
              <div style={{ marginBottom:22 }}>
                <p style={{ color:"#333", fontSize:8, letterSpacing:2, fontFamily:"'Space Mono',monospace", marginBottom:8 }}>YEAR</p>
                {years.map(y=><SideItem key={y} label={y} active={selectedYear===y} onClick={()=>setSelectedYear(y)} />)}
              </div>
              <div>
                <p style={{ color:"#333", fontSize:8, letterSpacing:2, fontFamily:"'Space Mono',monospace", marginBottom:8 }}>IMDb RATING</p>
                {RATINGS_FILTER.map(r=><SideItem key={r} label={r==="All"?"All Ratings":`⭐ ${r}`} active={selectedRating===r} onClick={()=>setSelectedRating(r)} />)}
              </div>
            </>}
          </aside>
        )}

        {/* ── MAIN ─────────────────────────────────────────────────── */}
        <main style={{ flex:1, padding: isMobile?"14px 12px 80px":"22px 22px 40px", minWidth:0, animation:"fadeIn 0.4s ease" }}>

          {/* Hero */}
          {!loading && featured.length>0 && (
            <HeroBanner movie={featured[heroIndex%featured.length]} onClick={setSelectedMovie} isMobile={isMobile} />
          )}

          {/* Demo banner */}
          {!loading && dataSource==="demo" && (
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"#110e00", border:"1px solid #F5C51840", borderRadius:8, padding: isMobile?"8px 12px":"9px 14px", marginBottom: isMobile?14:18 }}>
              <span style={{ fontSize:13 }}>⚡</span>
              <div style={{ flex:1, minWidth:0 }}>
                <span style={{ color:"#F5C518", fontFamily:"'Space Mono',monospace", fontSize: isMobile?9:10, fontWeight:700 }}>DEMO MODE </span>
                <span style={{ color:"#666", fontFamily:"'Space Mono',monospace", fontSize: isMobile?8:10 }}>Showing sample data.</span>
              </div>
              {!isMobile && <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" style={{ color:"#F5C518", fontFamily:"'Space Mono',monospace", fontSize:9, background:"#F5C51815", border:"1px solid #F5C51840", borderRadius:5, padding:"4px 10px", textDecoration:"none", flexShrink:0 }}>Setup →</a>}
            </div>
          )}

          {/* Section header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: isMobile?12:16 }}>
            <div>
              <h2 style={{ fontFamily:"'Anton',sans-serif", fontSize: isMobile?17:20, letterSpacing:1, color:"#fff" }}>
                {selectedGenre!=="All" ? selectedGenre.toUpperCase() : "ALL MOVIES"}
                {search && <span style={{ color:"#F5C518" }}> · "{search}"</span>}
              </h2>
              {!loading && <p style={{ color:"#444", fontSize:9, fontFamily:"'Space Mono',monospace", marginTop:2 }}>{filtered.length} titles</p>}
            </div>
            {hasFilters && (
              <button onClick={clearFilters} style={{ background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#888", padding:"5px 10px", borderRadius:6, cursor:"pointer", fontSize:9, fontFamily:"'Space Mono',monospace" }}>Clear ✕</button>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ display:"grid", gridTemplateColumns: isMobile?"repeat(2,1fr)":"repeat(auto-fill,minmax(155px,1fr))", gap: isMobile?10:14 }}>
              {[...Array(isMobile?6:8)].map((_,i)=><SkeletonCard key={i} />)}
            </div>
          ) : filtered.length===0 ? (
            <div style={{ textAlign:"center", padding:"50px 0", color:"#333" }}>
              <div style={{ fontSize:36, marginBottom:12 }}>🎬</div>
              <p style={{ fontFamily:"'Lora',serif", fontSize:14 }}>No movies match your filters.</p>
              {hasFilters && <button onClick={clearFilters} style={{ marginTop:14, background:"#F5C518", border:"none", color:"#000", padding:"8px 18px", borderRadius:8, cursor:"pointer", fontFamily:"'Anton',sans-serif", fontSize:13 }}>CLEAR FILTERS</button>}
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns: isMobile?"repeat(2,1fr)":"repeat(auto-fill,minmax(155px,1fr))", gap: isMobile?10:14 }}>
              {filtered.map(m=><MovieCard key={m.id} movie={m} onClick={setSelectedMovie} isMobile={isMobile} />)}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={()=>setSelectedMovie(null)} isMobile={isMobile} />}

      {/* ── MOBILE BOTTOM NAV ────────────────────────────────────────── */}
      {isMobile && (
        <nav style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:100, background:"rgba(8,8,8,0.98)", borderTop:"1px solid #1a1a1a", height:58, display:"flex", alignItems:"center", justifyContent:"space-around", backdropFilter:"blur(16px)" }}>
          {[["🏠","Home"],["⭐","Top"],["🎬","New"],["🔍","Search"]].map(([icon,label])=>(
            <button key={label} onClick={()=>{ if(label==="Search") setSearchOpen(o=>!o); }}
              style={{ background:"none", border:"none", color: label==="Home"?"#F5C518":"#555", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"6px 12px" }}>
              <span style={{ fontSize:18 }}>{icon}</span>
              <span style={{ fontSize:8, fontFamily:"'Space Mono',monospace" }}>{label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Footer (desktop only) */}
      {!isMobile && (
        <footer style={{ borderTop:"1px solid #0f0f0f", padding:"18px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"#050505" }}>
          <span style={{ fontFamily:"'Anton',sans-serif", fontSize:14, letterSpacing:2 }}>CINE<span style={{ color:"#F5C518" }}>CRITIC</span><span style={{ color:"#222", fontFamily:"'Space Mono',monospace", fontSize:9, marginLeft:10 }}>© 2025</span></span>
          <p style={{ color:"#222", fontSize:9, fontFamily:"'Space Mono',monospace" }}>Powered by Firebase · Hosted on Vercel</p>
        </footer>
      )}
    </div>
  );
}
