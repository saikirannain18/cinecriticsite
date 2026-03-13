// ─────────────────────────────────────────────────────────────────────
// AdminAddMovie.jsx — AI powered movie adder
// OTT platforms are loaded from Firebase ott_platforms collection
// To add new OTT: add document in Firebase, no code change needed!
// ─────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";

const GROQ_API_KEY = import.meta.env.VITE_MODAL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB;

// ── TMDB POSTER FETCH ─────────────────────────────────────────────────
async function fetchTmdbPoster(title, year) {
  if (!TMDB_API_KEY) {
    console.warn("TMDb: VITE_TMDB_KEY is missing");
    return null;
  }
  try {
    const query = encodeURIComponent(title.trim());
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${TMDB_API_KEY}`;
    console.log("TMDb URL:", url);
    const res  = await fetch(url);
    console.log("TMDb status:", res.status);
    const data = await res.json();
    console.log("TMDb full response:", JSON.stringify(data).slice(0, 500));
    const path = data.results?.[0]?.poster_path;
    if (!path) return null;
    return `https://image.tmdb.org/t/p/w1280${path}`;
  } catch (e) {
    console.error("TMDb fetch error:", e.message);
    return null;
  }
}

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDi9KTtfyOHY8McVA1ObzloNOekGY_tgfI",
  authDomain: "cinecriticdb.firebaseapp.com",
  projectId: "cinecriticdb",
  storageBucket: "cinecriticdb.firebasestorage.app",
  messagingSenderId: "855382839651",
  appId: "1:855382839651:web:e9fa724bd796e7af258356"
};

// ── FIREBASE HELPER ───────────────────────────────────────────────────
async function getFirebase() {
  const [{ initializeApp, getApps }, { getFirestore, collection, addDoc, getDocs }] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"),
  ]);
  const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
  return { fs: getFirestore(app), collection, addDoc, getDocs };
}

// ── GROQ AI HELPER ────────────────────────────────────────────────────
// Using Groq (free, fast, works in India) instead of Gemini
async function askGroq(movieName) {
  const prompt = `You are a movie database assistant. For the movie "${movieName}", return ONLY a valid JSON object. No explanation, no markdown, no code fences. Start directly with { and end with }.

{"title":"exact movie title","year":2023,"imdb":8.5,"director":"Director Full Name","runtime":"142 min","rating":"PG-13","reviewer":"CinéCritic","review":"A compelling 2-sentence critic review.","featured":false,"poster":"","genre":["Genre1","Genre2"],"ott":[]}

Rules:
- year: integer, no quotes
- imdb: decimal number like 8.5, no quotes
- genre: 1-3 items from: Action, Adventure, Animation, Comedy, Crime, Documentary, Drama, Fantasy, History, Horror, Music, Mystery, Romance, Sci-Fi, Thriller, War, Western
- rating: one of G, PG, PG-13, R, NC-17, UA, A
- poster: leave as empty string ""
- ott: empty array []`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Groq API error ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";
  if (!text) throw new Error("Groq returned empty response");

  // Find the JSON object in the response
  const jsonStart = text.indexOf("{");
  const jsonEnd   = text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("No JSON found in response: " + text.slice(0, 100));
  }

  return JSON.parse(text.slice(jsonStart, jsonEnd + 1));
}

// ── FIELD COMPONENT ───────────────────────────────────────────────────
const Field = ({ label, value, onChange, type="text", hint }) => (
  <div style={{ marginBottom:14 }}>
    <label style={{ display:"block", color:"#555", fontSize:9, fontFamily:"'Space Mono',monospace",
      letterSpacing:1, marginBottom:5 }}>{label}</label>
    <input type={type} value={value} onChange={e=>onChange(e.target.value)}
      style={{ width:"100%", background:"#111", border:"1px solid #222", borderRadius:7,
        color:"#fff", padding:"9px 12px", fontFamily:"'Space Mono',monospace", fontSize:11,
        outline:"none" }}
      onFocus={e=>e.target.style.borderColor="#F5C518"}
      onBlur={e=>e.target.style.borderColor="#222"} />
    {hint && <p style={{ color:"#333", fontSize:8, fontFamily:"'Space Mono',monospace", margin:"4px 0 0" }}>{hint}</p>}
  </div>
);

const TextArea = ({ label, value, onChange }) => (
  <div style={{ marginBottom:14 }}>
    <label style={{ display:"block", color:"#555", fontSize:9, fontFamily:"'Space Mono',monospace",
      letterSpacing:1, marginBottom:5 }}>{label}</label>
    <textarea value={value} onChange={e=>onChange(e.target.value)} rows={3}
      style={{ width:"100%", background:"#111", border:"1px solid #222", borderRadius:7,
        color:"#fff", padding:"9px 12px", fontFamily:"'Lora',serif", fontSize:12,
        outline:"none", resize:"vertical" }}
      onFocus={e=>e.target.style.borderColor="#F5C518"}
      onBlur={e=>e.target.style.borderColor="#222"} />
  </div>
);

// ── MAIN ADMIN PAGE ───────────────────────────────────────────────────
export default function AdminAddMovie() {
  const [movieSearch,  setMovieSearch]  = useState("");
  const [status,       setStatus]       = useState("idle");
  const [error,        setError]        = useState("");
  const [selectedOtt,  setSelectedOtt]  = useState([]);
  const [ottPlatforms, setOttPlatforms] = useState([]); // loaded from Firebase

  // Load OTT platforms from Firebase on mount
  useEffect(() => {
    (async () => {
      try {
        const fb = await getFirebase();
        const snap = await fb.getDocs(fb.collection(fb.fs, "ott_platforms"));
        const list = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.order || 99) - (b.order || 99));
        if (list.length) setOttPlatforms(list);
      } catch (e) {
        console.log("Could not load OTT platforms:", e.message);
      }
    })();
  }, []);

  // Movie fields
  const [title,    setTitle]    = useState("");
  const [year,     setYear]     = useState("");
  const [imdb,     setImdb]     = useState("");
  const [director, setDirector] = useState("");
  const [runtime,  setRuntime]  = useState("");
  const [rating,   setRating]   = useState("");
  const [review,   setReview]   = useState("");
  const [reviewer, setReviewer] = useState("CinéCritic");
  const [featured, setFeatured] = useState(false);
  const [poster,   setPoster]   = useState("");
  const [genre,    setGenre]    = useState("");

  const resetForm = () => {
    setTitle(""); setYear(""); setImdb(""); setDirector("");
    setRuntime(""); setRating(""); setReview(""); setPoster("");
    setGenre(""); setFeatured(false); setSelectedOtt([]);
    setMovieSearch(""); setStatus("idle");
  };

  // ── STEP 1: Ask Groq then fetch TMDb poster ─────────────────────────
  const handleGenerate = async () => {
    if (!movieSearch.trim()) return;
    if (GROQ_API_KEY === "YOUR_GROQ_API_KEY" || !GROQ_API_KEY) {
      setError("❌ VITE_GROQ_KEY missing from .env");
      setStatus("error");
      return;
    }
    if (!TMDB_API_KEY) {
      setError("⚠️ VITE_TMDB_KEY missing — add it to .env AND Vercel env vars, then redeploy");
    }
    setStatus("loading");
    try {
      const data = await askGroq(movieSearch);
      setTitle(data.title    || "");
      setYear(String(data.year || ""));
      setImdb(String(data.imdb || ""));
      setDirector(data.director || "");
      setRuntime(data.runtime   || "");
      setRating(data.rating     || "");
      setReview(data.review     || "");
      setReviewer(data.reviewer || "CinéCritic");
      setFeatured(data.featured || false);
      setGenre((data.genre||[]).join(", "));
      setSelectedOtt([]);

      // Auto-fetch poster from TMDb
      if (TMDB_API_KEY) {
        const tmdbPoster = await fetchTmdbPoster(data.title || movieSearch, data.year);
        if (tmdbPoster) {
          setPoster(tmdbPoster);
          setError(""); // clear any warning
        } else {
          setPoster(data.poster || "");
          setError("⚠️ TMDb found no poster for this movie. You can paste a URL manually.");
        }
      } else {
        setPoster(data.poster || "");
      }

      setStatus("ready");
    } catch (e) {
      setError("❌ Groq failed. Try a different spelling or check your API key.");
      setStatus("error");
    }
  };

  // ── STEP 2: Save to Firebase ────────────────────────────────────────
  const handleSave = async () => {
    if (!title || !year || !imdb) {
      setError("Title, year and IMDb score are required.");
      return;
    }
    setStatus("saving");
    setError("");
    try {
      const fb = await getFirebase();
      const doc = {
        title,
        year:     parseInt(year),
        imdb:     parseFloat(imdb),
        director,
        runtime,
        rating,
        review,
        reviewer,
        featured,
        poster,
        genre:    genre.split(",").map(g=>g.trim()).filter(Boolean),
        ott:      selectedOtt,
      };
      await fb.addDoc(fb.collection(fb.fs, "movies"), doc);
      setStatus("saved");
    } catch (e) {
      setError("Firebase save failed: " + e.message);
      setStatus("ready");
    }
  };

  const toggleOtt = (name) => {
    setSelectedOtt(prev =>
      prev.includes(name) ? prev.filter(u => u !== name) : [...prev, name]
    );
  };

  return (
    <div style={{ minHeight:"100vh", background:"#080808", color:"#fff", padding:"0 0 60px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Lora:ital,wght@0,400;1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
      <style>{`* { box-sizing:border-box; margin:0; padding:0; } input,textarea { caret-color:#F5C518; }`}</style>

      {/* Header */}
      <div style={{ background:"#0a0a0a", borderBottom:"1px solid #161616", padding:"16px 20px",
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:26, height:26, background:"#F5C518", borderRadius:5,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🎬</div>
          <span style={{ fontFamily:"'Anton',sans-serif", fontSize:18, letterSpacing:2 }}>
            CINE<span style={{ color:"#F5C518" }}>CRITIC</span>
          </span>
          <span style={{ background:"#F5C51820", border:"1px solid #F5C51840", color:"#F5C518",
            borderRadius:20, padding:"2px 10px", fontSize:9, fontFamily:"'Space Mono',monospace" }}>ADMIN</span>
        </div>
        <a href="/" style={{ color:"#555", fontSize:10, fontFamily:"'Space Mono',monospace", textDecoration:"none" }}>← Back to site</a>
      </div>

      <div style={{ maxWidth:640, margin:"0 auto", padding:"28px 20px" }}>

        {/* Page title */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:"'Anton',sans-serif", fontSize:26, letterSpacing:2, color:"#F5C518", margin:"0 0 6px" }}>
            ADD MOVIE WITH AI
          </h1>
          <p style={{ color:"#444", fontSize:10, fontFamily:"'Space Mono',monospace" }}>
            Type any movie name → Groq AI fills all details → Save to Firebase instantly
          </p>
        </div>

        {/* API key warning */}
        {GROQ_API_KEY === "YOUR_GROQ_API_KEY" || !GROQ_API_KEY && (
          <div style={{ background:"#1a0a00", border:"1px solid #F5C51860", borderRadius:10,
            padding:"14px 16px", marginBottom:24 }}>
            <p style={{ color:"#F5C518", fontSize:10, fontFamily:"'Space Mono',monospace", margin:"0 0 6px" }}>⚠ GROQ API KEY MISSING</p>
            <p style={{ color:"#888", fontSize:11, lineHeight:1.6, margin:0 }}>
              1. Go to <a href="https://console.groq.com" target="_blank" rel="noreferrer"
                style={{ color:"#F5C518" }}>console.groq.com</a> — it's free<br/>
              2. Click "Create API Key"<br/>
              3. Paste it at the top of <code style={{ color:"#F5C518" }}>.env file</code>
            </p>
          </div>
        )}

        {/* ── STEP 1: Search box ── */}
        <div style={{ background:"#0d0d0d", border:"1px solid #1a1a1a", borderRadius:12, padding:"20px", marginBottom:20 }}>
          <p style={{ color:"#F5C518", fontSize:8, fontFamily:"'Anton',sans-serif", letterSpacing:2, marginBottom:14 }}>
            STEP 1 — SEARCH MOVIE
          </p>
          <div style={{ display:"flex", gap:10 }}>
            <input
              value={movieSearch}
              onChange={e=>setMovieSearch(e.target.value)}
              onKeyDown={e=>e.key==="Enter" && handleGenerate()}
              placeholder="e.g. Interstellar, The Dark Knight, RRR..."
              style={{ flex:1, background:"#111", border:"1px solid #222", borderRadius:8,
                color:"#fff", padding:"10px 14px", fontFamily:"'Space Mono',monospace", fontSize:12, outline:"none" }}
              onFocus={e=>e.target.style.borderColor="#F5C518"}
              onBlur={e=>e.target.style.borderColor="#222"}
            />
            <button onClick={handleGenerate} disabled={status==="loading" || !movieSearch.trim()}
              style={{ background: status==="loading" ? "#333" : "#F5C518",
                color: status==="loading" ? "#666" : "#000",
                border:"none", borderRadius:8, padding:"10px 18px",
                fontFamily:"'Anton',sans-serif", fontSize:13, letterSpacing:1,
                cursor: status==="loading" ? "not-allowed" : "pointer",
                display:"flex", alignItems:"center", gap:8, flexShrink:0,
                transition:"all 0.2s" }}>
              {status==="loading" ? (
                <>
                  <span style={{ animation:"spin 1s linear infinite", display:"inline-block" }}>⟳</span>
                  AI thinking...
                </>
              ) : "✨ FETCH WITH GROQ AI"}
            </button>
          </div>
          {error && (
            <div style={{ marginTop:12, background:"#1a0000", border:"1px solid #f4433640",
              borderRadius:8, padding:"10px 14px" }}>
              <p style={{ color:"#f44336", fontSize:10, fontFamily:"'Space Mono',monospace", margin:0 }}>⚠ {error}</p>
            </div>
          )}
        </div>

        {/* ── STEP 2: Edit fields ── */}
        {(status==="ready" || status==="saving" || status==="error") && (
          <div style={{ background:"#0d0d0d", border:"1px solid #1a1a1a", borderRadius:12, padding:"20px", marginBottom:20 }}>
            <p style={{ color:"#4caf50", fontSize:8, fontFamily:"'Anton',sans-serif", letterSpacing:2, marginBottom:18 }}>
              ✓ STEP 2 — REVIEW &amp; EDIT (Groq AI filled these in)
            </p>

            {/* Poster preview */}
            {poster && (
              <div style={{ display:"flex", gap:16, marginBottom:20, alignItems:"flex-start" }}>
                <img src={poster} alt="poster"
                  style={{ width:80, borderRadius:8, objectFit:"cover", border:"1px solid #222" }}
                  onError={e=>e.target.style.display="none"} />
                <div style={{ flex:1 }}>
                  <p style={{ color:"#4caf50", fontSize:9, fontFamily:"'Space Mono',monospace", marginBottom:4 }}>✓ Poster found</p>
                  <p style={{ color:"#444", fontSize:9, fontFamily:"'Space Mono',monospace", wordBreak:"break-all" }}>{poster}</p>
                </div>
              </div>
            )}

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
              <Field label="TITLE" value={title} onChange={setTitle} />
              <Field label="YEAR" value={year} onChange={setYear} type="number" />
              <Field label="IMDb SCORE" value={imdb} onChange={setImdb} type="number" hint="e.g. 8.5" />
              <Field label="RUNTIME" value={runtime} onChange={setRuntime} hint="e.g. 148 min" />
              <Field label="RATING" value={rating} onChange={setRating} hint="PG, PG-13, R..." />
              <Field label="DIRECTOR" value={director} onChange={setDirector} />
            </div>

            <Field label="GENRE (comma separated)" value={genre} onChange={setGenre} hint="e.g. Action, Sci-Fi, Drama" />
            <Field label="POSTER URL" value={poster} onChange={setPoster} hint="TMDb URL from above, or paste your own" />
            <TextArea label="REVIEW" value={review} onChange={setReview} />
            <Field label="REVIEWER NAME" value={reviewer} onChange={setReviewer} />

            {/* Featured toggle */}
            <div style={{ marginBottom:18 }}>
              <label style={{ display:"block", color:"#555", fontSize:9, fontFamily:"'Space Mono',monospace",
                letterSpacing:1, marginBottom:8 }}>FEATURED (show in hero banner)</label>
              <div style={{ display:"flex", gap:10 }}>
                {[true, false].map(v => (
                  <button key={String(v)} onClick={()=>setFeatured(v)}
                    style={{ flex:1, padding:"9px", borderRadius:8, cursor:"pointer",
                      background: featured===v ? "#F5C51820" : "#111",
                      border: `1px solid ${featured===v ? "#F5C518" : "#222"}`,
                      color: featured===v ? "#F5C518" : "#555",
                      fontFamily:"'Space Mono',monospace", fontSize:11 }}>
                    {v ? "✓ YES — Show in hero banner" : "✗ NO — Grid only"}
                  </button>
                ))}
              </div>
            </div>

            {/* OTT selector — loaded from Firebase ott_platforms collection */}
            <div style={{ marginBottom:20 }}>
              <label style={{ display:"block", color:"#555", fontSize:9, fontFamily:"'Space Mono',monospace",
                letterSpacing:1, marginBottom:10 }}>AVAILABLE ON OTT (tap to select)</label>
              {ottPlatforms.length === 0 ? (
                <p style={{ color:"#444", fontSize:10, fontFamily:"'Space Mono',monospace" }}>
                  No OTT platforms found in Firebase. Add documents to the <code style={{color:"#F5C518"}}>ott_platforms</code> collection.
                </p>
              ) : (
                <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                  {ottPlatforms.map(p => {
                    const active = selectedOtt.includes(p.name);
                    return (
                      <div key={p.name} onClick={() => toggleOtt(p.name)}
                        style={{ cursor:"pointer", textAlign:"center" }}>
                        <div style={{ width:52, height:52, borderRadius:12,
                          border: `2px solid ${active ? "#F5C518" : "#333"}`,
                          background:"#fff", padding:5,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          boxShadow: active ? "0 0 14px rgba(245,197,24,0.5)" : "none",
                          transition:"all 0.2s" }}>
                          <img src={p.image} alt={p.name}
                            style={{ width:"100%", height:"100%", objectFit:"contain" }}
                            onError={e => { e.target.parentElement.style.background="#1a1a1a"; e.target.style.display="none"; }} />
                        </div>
                        <p style={{ color: active ? "#F5C518" : "#555", fontSize:8,
                          fontFamily:"'Space Mono',monospace", marginTop:4 }}>{p.name}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 3: Save button ── */}
        {(status==="ready" || status==="saving") && (
          <button onClick={handleSave} disabled={status==="saving"}
            style={{ width:"100%", background: status==="saving" ? "#333" : "#F5C518",
              color: status==="saving" ? "#666" : "#000",
              border:"none", borderRadius:12, padding:"16px",
              fontFamily:"'Anton',sans-serif", fontSize:16, letterSpacing:2,
              cursor: status==="saving" ? "not-allowed" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              transition:"all 0.2s" }}>
            {status==="saving" ? "SAVING TO FIREBASE..." : "🔥 SAVE TO FIREBASE"}
          </button>
        )}

        {/* ── SUCCESS ── */}
        {status==="saved" && (
          <div style={{ background:"#001a0a", border:"1px solid #4caf5060", borderRadius:12, padding:"24px",
            textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🎉</div>
            <h2 style={{ fontFamily:"'Anton',sans-serif", fontSize:22, color:"#4caf50",
              letterSpacing:1, marginBottom:8 }}>SAVED TO FIREBASE!</h2>
            <p style={{ color:"#888", fontSize:11, fontFamily:"'Space Mono',monospace", marginBottom:20 }}>
              "{title}" is now live on your site
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={resetForm}
                style={{ flex:1, background:"#F5C518", border:"none", color:"#000",
                  borderRadius:10, padding:"12px", cursor:"pointer",
                  fontFamily:"'Anton',sans-serif", fontSize:14, letterSpacing:1 }}>
                ✨ ADD ANOTHER MOVIE
              </button>
              <a href="/" style={{ flex:1, background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#fff",
                borderRadius:10, padding:"12px", cursor:"pointer", textDecoration:"none",
                fontFamily:"'Anton',sans-serif", fontSize:14, letterSpacing:1,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                VIEW SITE →
              </a>
            </div>
          </div>
        )}

      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}