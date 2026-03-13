// ═══════════════════════════════════════════════════════════════════════
// AdminApp.jsx — CinéCritic Command Center
// Login → Dashboard (Movies CRUD | Analytics | System Health | OTT Mgmt)
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";

// ── ENV KEYS ────────────────────────────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_MODAL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB;

// ── FIREBASE CONFIG ─────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyDi9KTtfyOHY8McVA1ObzloNOekGY_tgfI",
  authDomain:        "cinecriticdb.firebaseapp.com",
  projectId:         "cinecriticdb",
  storageBucket:     "cinecriticdb.firebasestorage.app",
  messagingSenderId: "855382839651",
  appId:             "1:855382839651:web:e9fa724bd796e7af258356"
};

// ── FIREBASE HELPER ─────────────────────────────────────────────────────
let _fb = null;
async function getFirebase() {
  if (_fb) return _fb;
  const [{ initializeApp, getApps }, {
    getFirestore, collection, getDocs, addDoc,
    updateDoc, deleteDoc, doc, onSnapshot, setDoc, query, orderBy, limit
  }] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"),
  ]);
  const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
  const fs  = getFirestore(app);
  _fb = { fs, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, setDoc, query, orderBy, limit };
  return _fb;
}

// ── TMDB POSTER ──────────────────────────────────────────────────────────
async function fetchTmdbPoster(title, year) {
  if (!TMDB_API_KEY) return null;
  try {
    const q = encodeURIComponent(title.trim());
    let res  = await fetch(`https://api.themoviedb.org/3/search/movie?query=${q}&year=${year}&api_key=${TMDB_API_KEY}`);
    let data = await res.json();
    if (data.results?.[0]?.poster_path)
      return `https://image.tmdb.org/t/p/w1280${data.results[0].poster_path}`;
    res  = await fetch(`https://api.themoviedb.org/3/search/movie?query=${q}&api_key=${TMDB_API_KEY}`);
    data = await res.json();
    if (data.results?.[0]?.poster_path)
      return `https://image.tmdb.org/t/p/w1280${data.results[0].poster_path}`;
    return null;
  } catch { return null; }
}

// ── GROQ AI ───────────────────────────────────────────────────────────────
async function askGroq(movieName) {
  const sys = `You are a movie database assistant. Return ONLY valid JSON, no markdown, no explanation.
Schema: {"title":"exact movie title","year":2023,"imdb":8.5,"director":"Full Name","runtime":"142 min","rating":"PG-13","reviewer":"CinéCritic","review":"2-sentence critic review.","featured":false,"poster":"","genre":["Genre1","Genre2"],"ott":[]}`;
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 600,
      messages: [
        { role: "system", content: sys },
        { role: "user",   content: `Movie: "${movieName}"` }
      ]
    })
  });
  const data = await res.json();
  const raw  = data.choices?.[0]?.message?.content || "{}";
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}

// ── STYLES ────────────────────────────────────────────────────────────────
const C = {
  bg:      "#080808",
  surface: "#0f0f0f",
  border:  "#1a1a1a",
  border2: "#252525",
  yellow:  "#F5C518",
  red:     "#ff4444",
  green:   "#22c55e",
  blue:    "#3b82f6",
  orange:  "#f97316",
  text:    "#ffffff",
  muted:   "#555555",
  sub:     "#888888",
};

const mono   = "'Space Mono', monospace";
const serif  = "'Lora', serif";
const display = "'Anton', sans-serif";

const btn = (color = C.yellow, textColor = "#000") => ({
  background: color, color: textColor, border: "none",
  padding: "8px 16px", borderRadius: 8, cursor: "pointer",
  fontFamily: mono, fontSize: 11, letterSpacing: 1, fontWeight: 700,
});

const input = {
  background: "#111", border: `1px solid ${C.border2}`, color: C.text,
  padding: "9px 12px", borderRadius: 8, fontFamily: mono, fontSize: 11,
  width: "100%", outline: "none",
};

const card = {
  background: C.surface, border: `1px solid ${C.border}`,
  borderRadius: 12, padding: 20,
};

// ═══════════════════════════════════════════════════════════════════════
// ROOT ENTRY
// ═══════════════════════════════════════════════════════════════════════
export default function AdminApp() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("cc_admin") || "null"); } catch { return null; }
  });

  const handleLogin  = (admin) => {
    sessionStorage.setItem("cc_admin", JSON.stringify(admin));
    setSession(admin);
  };
  const handleLogout = () => {
    sessionStorage.removeItem("cc_admin");
    setSession(null);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Lora:ital@0;1&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; color: ${C.text}; font-family: ${mono}; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
        input:focus, textarea:focus, select:focus { border-color: ${C.yellow} !important; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn .3s ease; }
        .pulse { animation: pulse 2s infinite; }
        .spin { animation: spin .8s linear infinite; display:inline-block; }
      `}</style>
      {session ? <Dashboard admin={session} onLogout={handleLogout} /> : <LoginScreen onLogin={handleLogin} />}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [email, setEmail]   = useState("");
  const [pass,  setPass]    = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !pass) { setError("Enter email and password"); return; }
    setLoading(true); setError("");
    try {
      const fb   = await getFirebase();
      const snap = await fb.getDocs(fb.collection(fb.fs, "admins"));
      const admins = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const found  = admins.find(a =>
        a.email?.toLowerCase() === email.toLowerCase() && a.password === pass
      );
      if (found) {
        onLogin({ id: found.id, name: found.name || "Admin", email: found.email });
      } else {
        setError("Invalid email or password");
      }
    } catch (e) {
      setError("Could not connect to database. Check Firebase rules.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, padding: 20 }}>
      <div className="fade-in" style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <div style={{ width:36, height:36, background: C.yellow, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🎬</div>
            <span style={{ fontFamily: display, fontSize: 24, letterSpacing: 3 }}>CINE<span style={{ color: C.yellow }}>CRITIC</span></span>
          </div>
          <p style={{ color: C.muted, fontSize: 10, letterSpacing: 2 }}>COMMAND CENTER</p>
        </div>

        {/* Form */}
        <div style={{ ...card, padding: 32 }}>
          <p style={{ fontSize: 10, color: C.sub, letterSpacing: 2, marginBottom: 24 }}>ADMIN LOGIN</p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display:"block", color: C.muted, fontSize: 9, letterSpacing: 1, marginBottom: 6 }}>EMAIL</label>
              <input style={input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" autoFocus />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display:"block", color: C.muted, fontSize: 9, letterSpacing: 1, marginBottom: 6 }}>PASSWORD</label>
              <input style={input} type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" />
            </div>
            {error && <p style={{ color: C.red, fontSize: 10, marginBottom: 16, padding:"8px 12px", background:"#1a0000", borderRadius:6, border:`1px solid #440000` }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ ...btn(), width:"100%", padding:"12px 0", fontSize:12 }}>
              {loading ? <span className="spin">⟳</span> : "ACCESS DASHBOARD →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign:"center", color:"#222", fontSize:9, marginTop:20, letterSpacing:1 }}>
          CINÉCRITIC ADMIN v2.0
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════
const TABS = [
  { id:"overview",  label:"Overview",      icon:"◈" },
  { id:"movies",    label:"Movies",        icon:"▤" },
  { id:"analytics", label:"Analytics",     icon:"▲" },
  { id:"system",    label:"System Health", icon:"◉" },
  { id:"ott",       label:"OTT Platforms", icon:"◎" },
];

function Dashboard({ admin, onLogout }) {
  const [tab,     setTab]     = useState("overview");
  const [movies,  setMovies]  = useState([]);
  const [ottPlatforms, setOttPlatforms] = useState([]);
  const [analytics, setAnalytics] = useState({ totalVisits:0, todayVisits:0, topMovies:[] });
  const [dbStatus, setDbStatus] = useState("checking"); // checking | live | error

  // Load movies
  useEffect(() => {
    (async () => {
      try {
        const fb   = await getFirebase();
        fb.onSnapshot(fb.collection(fb.fs, "movies"), snap => {
          setMovies(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          setDbStatus("live");
        }, () => setDbStatus("error"));
      } catch { setDbStatus("error"); }
    })();
  }, []);

  // Load OTT platforms
  useEffect(() => {
    (async () => {
      try {
        const fb   = await getFirebase();
        const snap = await fb.getDocs(fb.collection(fb.fs, "ott_platforms"));
        setOttPlatforms(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b)=>(a.order||99)-(b.order||99)));
      } catch {}
    })();
  }, []);

  // Load analytics
  useEffect(() => {
    (async () => {
      try {
        const fb   = await getFirebase();
        const snap = await fb.getDocs(fb.collection(fb.fs, "analytics"));
        const data = {};
        snap.docs.forEach(d => { data[d.id] = d.data(); });
        const today = new Date().toISOString().slice(0,10);
        setAnalytics({
          totalVisits:  data.visits?.total || 0,
          todayVisits:  data.visits?.daily?.[today] || 0,
          topMovies:    data.topMovies?.list || [],
        });
      } catch {}
    })();
  }, []);

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      {/* Top Bar */}
      <header style={{ background: C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 24px", height:52, display:"flex", alignItems:"center", gap:16, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, background:C.yellow, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🎬</div>
          <span style={{ fontFamily:display, fontSize:18, letterSpacing:2 }}>CINE<span style={{color:C.yellow}}>CRITIC</span></span>
          <span style={{ color:"#222", fontSize:10, marginLeft:4 }}>/ ADMIN</span>
        </div>

        {/* DB Status pill */}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, background:"#0a0a0a", border:`1px solid ${C.border2}`, borderRadius:20, padding:"4px 12px" }}>
            <span className={dbStatus==="checking" ? "pulse" : ""} style={{ width:7, height:7, borderRadius:"50%", background: dbStatus==="live" ? C.green : dbStatus==="error" ? C.red : C.orange, display:"inline-block" }} />
            <span style={{ fontSize:9, color: dbStatus==="live" ? C.green : dbStatus==="error" ? C.red : C.orange, letterSpacing:1 }}>
              {dbStatus==="live" ? "DB LIVE" : dbStatus==="error" ? "DB ERROR" : "CONNECTING"}
            </span>
          </div>
          <span style={{ color:C.sub, fontSize:10 }}>{admin.name}</span>
          <button onClick={onLogout} style={{ ...btn("#1a1a1a","#888"), padding:"6px 12px", fontSize:10, border:`1px solid ${C.border2}` }}>LOGOUT</button>
        </div>
      </header>

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        {/* Sidebar */}
        <nav style={{ width:180, background:C.surface, borderRight:`1px solid ${C.border}`, padding:"16px 0", flexShrink:0, display:"flex", flexDirection:"column" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 20px", background: tab===t.id ? "#F5C51815" : "transparent",
                borderLeft: tab===t.id ? `2px solid ${C.yellow}` : "2px solid transparent",
                border:"none", borderRight:"none", cursor:"pointer", width:"100%", textAlign:"left",
                color: tab===t.id ? C.yellow : C.sub, fontSize:10, letterSpacing:1, fontFamily:mono }}>
              <span style={{ fontSize:14 }}>{t.icon}</span> {t.label.toUpperCase()}
            </button>
          ))}

          {/* Stats at bottom */}
          <div style={{ marginTop:"auto", padding:"16px 20px", borderTop:`1px solid ${C.border}` }}>
            <p style={{ color:"#222", fontSize:9, letterSpacing:1, marginBottom:8 }}>QUICK STATS</p>
            <p style={{ color:C.muted, fontSize:10 }}><span style={{ color:C.yellow }}>{movies.length}</span> movies</p>
            <p style={{ color:C.muted, fontSize:10, marginTop:4 }}><span style={{ color:C.yellow }}>{movies.filter(m=>m.featured).length}</span> featured</p>
            <p style={{ color:C.muted, fontSize:10, marginTop:4 }}><span style={{ color:C.yellow }}>{ottPlatforms.length}</span> platforms</p>
          </div>
        </nav>

        {/* Main Content */}
        <main style={{ flex:1, overflow:"auto", padding:24 }}>
          <div className="fade-in" key={tab}>
            {tab === "overview"  && <OverviewTab movies={movies} analytics={analytics} dbStatus={dbStatus} />}
            {tab === "movies"    && <MoviesTab movies={movies} ottPlatforms={ottPlatforms} />}
            {tab === "analytics" && <AnalyticsTab analytics={analytics} movies={movies} />}
            {tab === "system"    && <SystemTab dbStatus={dbStatus} />}
            {tab === "ott"       && <OttTab ottPlatforms={ottPlatforms} setOttPlatforms={setOttPlatforms} />}
          </div>
        </main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TAB: OVERVIEW
// ═══════════════════════════════════════════════════════════════════════
function OverviewTab({ movies, analytics, dbStatus }) {
  const featured  = movies.filter(m => m.featured).length;
  const avgImdb   = movies.length ? (movies.reduce((s,m) => s + (m.imdb||0), 0) / movies.length).toFixed(1) : "—";
  const genres    = [...new Set(movies.flatMap(m => m.genre||[]))].length;

  const statCards = [
    { label:"Total Movies",    value: movies.length,          color: C.yellow },
    { label:"Featured",        value: featured,               color: C.blue   },
    { label:"Avg IMDb",        value: avgImdb,                color: C.green  },
    { label:"Genres",          value: genres,                 color: C.orange },
    { label:"Today Visits",    value: analytics.todayVisits,  color: "#a855f7"},
    { label:"Total Visits",    value: analytics.totalVisits,  color: "#ec4899"},
  ];

  return (
    <div>
      <SectionHeader title="Overview" sub="Welcome back — here's your site at a glance" />

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px,1fr))", gap:12, marginBottom:28 }}>
        {statCards.map(s => (
          <div key={s.label} style={{ ...card, padding:20 }}>
            <p style={{ color:C.muted, fontSize:9, letterSpacing:1 }}>{s.label.toUpperCase()}</p>
            <p style={{ fontFamily:display, fontSize:32, color:s.color, marginTop:6 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent movies */}
      <SectionHeader title="Recent Movies" sub="Last 5 added" />
      <div style={{ ...card, padding:0, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}` }}>
              {["Title","Year","IMDb","Director","Featured"].map(h => (
                <th key={h} style={{ padding:"10px 16px", textAlign:"left", color:C.muted, fontSize:9, letterSpacing:1, fontWeight:400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {movies.slice(-5).reverse().map(m => (
              <tr key={m.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                <td style={{ padding:"10px 16px", fontSize:11, color:C.text }}>{m.title}</td>
                <td style={{ padding:"10px 16px", fontSize:11, color:C.sub }}>{m.year}</td>
                <td style={{ padding:"10px 16px", fontSize:11, color:C.yellow }}>{m.imdb}</td>
                <td style={{ padding:"10px 16px", fontSize:11, color:C.sub }}>{m.director}</td>
                <td style={{ padding:"10px 16px" }}>
                  {m.featured && <span style={{ background:"#F5C51820", color:C.yellow, fontSize:9, padding:"2px 8px", borderRadius:4 }}>★ YES</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TAB: MOVIES CRUD
// ═══════════════════════════════════════════════════════════════════════
function MoviesTab({ movies, ottPlatforms }) {
  const [view,   setView]   = useState("list"); // list | add | edit
  const [editMovie, setEditMovie] = useState(null);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [msg, setMsg]       = useState("");

  const filtered = movies.filter(m =>
    m.title?.toLowerCase().includes(search.toLowerCase()) ||
    m.director?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (movie) => {
    if (!window.confirm(`Delete "${movie.title}"?`)) return;
    setDeleting(movie.id);
    try {
      const fb = await getFirebase();
      await fb.deleteDoc(fb.doc(fb.fs, "movies", movie.id));
      setMsg(`✓ "${movie.title}" deleted`);
      setTimeout(() => setMsg(""), 3000);
    } catch { setMsg("❌ Delete failed"); }
    setDeleting(null);
  };

  if (view === "add")  return <MovieForm mode="add" ottPlatforms={ottPlatforms} onBack={() => setView("list")} />;
  if (view === "edit") return <MovieForm mode="edit" movie={editMovie} ottPlatforms={ottPlatforms} onBack={() => setView("list")} />;

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <SectionHeader title="Movies" sub={`${movies.length} total in database`} noMargin />
        <div style={{ marginLeft:"auto", display:"flex", gap:10 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search movies..." style={{ ...input, width:200, padding:"7px 12px" }} />
          <button onClick={() => setView("add")} style={{ ...btn(), whiteSpace:"nowrap" }}>+ ADD MOVIE</button>
        </div>
      </div>

      {msg && <div style={{ background:"#0a1a0a", border:`1px solid #1a4a1a`, borderRadius:8, padding:"10px 16px", marginBottom:16, fontSize:11, color:C.green }}>{msg}</div>}

      <div style={{ ...card, padding:0, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}` }}>
              {["Poster","Title","Year","IMDb","Director","OTT","Actions"].map(h => (
                <th key={h} style={{ padding:"10px 14px", textAlign:"left", color:C.muted, fontSize:9, letterSpacing:1, fontWeight:400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} style={{ borderBottom:`1px solid ${C.border}` }}
                  onMouseEnter={e=>e.currentTarget.style.background="#ffffff08"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{ padding:"8px 14px" }}>
                  {m.poster
                    ? <img src={m.poster} alt="" style={{ width:28, height:42, objectFit:"cover", borderRadius:3 }} onError={e=>e.target.style.display="none"} />
                    : <div style={{ width:28, height:42, background:"#1a1a1a", borderRadius:3, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10 }}>?</div>
                  }
                </td>
                <td style={{ padding:"8px 14px" }}>
                  <p style={{ fontSize:11, color:C.text }}>{m.title}</p>
                  {m.featured && <span style={{ fontSize:8, color:C.yellow }}>★ FEATURED</span>}
                </td>
                <td style={{ padding:"8px 14px", fontSize:11, color:C.sub }}>{m.year}</td>
                <td style={{ padding:"8px 14px", fontSize:12, color:C.yellow, fontWeight:700 }}>{m.imdb}</td>
                <td style={{ padding:"8px 14px", fontSize:11, color:C.sub }}>{m.director}</td>
                <td style={{ padding:"8px 14px" }}>
                  <div style={{ display:"flex", gap:3, flexWrap:"wrap", maxWidth:100 }}>
                    {(m.ott||[]).slice(0,2).map((o,i) => (
                      <span key={i} style={{ fontSize:8, background:"#1a1a1a", border:`1px solid ${C.border2}`, borderRadius:3, padding:"1px 5px", color:C.sub }}>{o}</span>
                    ))}
                    {(m.ott||[]).length > 2 && <span style={{ fontSize:8, color:C.muted }}>+{m.ott.length-2}</span>}
                  </div>
                </td>
                <td style={{ padding:"8px 14px" }}>
                  <div style={{ display:"flex", gap:6 }}>
                    <button onClick={() => { setEditMovie(m); setView("edit"); }}
                      style={{ ...btn(C.blue,"#fff"), padding:"4px 10px", fontSize:9 }}>EDIT</button>
                    <button onClick={() => handleDelete(m)} disabled={deleting===m.id}
                      style={{ ...btn(C.red,"#fff"), padding:"4px 10px", fontSize:9, opacity: deleting===m.id ? 0.5 : 1 }}>
                      {deleting===m.id ? "..." : "DEL"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={7} style={{ padding:32, textAlign:"center", color:C.muted, fontSize:11 }}>No movies found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── MOVIE FORM (ADD / EDIT) ───────────────────────────────────────────
function MovieForm({ mode, movie, ottPlatforms, onBack }) {
  const [movieSearch, setMovieSearch] = useState("");
  const [status, setStatus]   = useState(mode==="edit" ? "ready" : "idle");
  const [error,  setError]    = useState("");
  const [msg,    setMsg]      = useState("");

  // Fields
  const [title,    setTitle]    = useState(movie?.title    || "");
  const [year,     setYear]     = useState(String(movie?.year || ""));
  const [imdb,     setImdb]     = useState(String(movie?.imdb || ""));
  const [director, setDirector] = useState(movie?.director || "");
  const [runtime,  setRuntime]  = useState(movie?.runtime  || "");
  const [rating,   setRating]   = useState(movie?.rating   || "");
  const [review,   setReview]   = useState(movie?.review   || "");
  const [reviewer, setReviewer] = useState(movie?.reviewer || "CinéCritic");
  const [featured, setFeatured] = useState(movie?.featured || false);
  const [poster,   setPoster]   = useState(movie?.poster   || "");
  const [genre,    setGenre]    = useState((movie?.genre||[]).join(", "));
  const [selectedOtt, setSelectedOtt] = useState(movie?.ott || []);

  const toggleOtt = (name) => setSelectedOtt(p => p.includes(name) ? p.filter(x=>x!==name) : [...p,name]);

  const handleGenerate = async () => {
    if (!movieSearch.trim()) return;
    setStatus("loading"); setError("");
    try {
      const data = await askGroq(movieSearch);
      setTitle(data.title||""); setYear(String(data.year||"")); setImdb(String(data.imdb||""));
      setDirector(data.director||""); setRuntime(data.runtime||""); setRating(data.rating||"");
      setReview(data.review||""); setReviewer(data.reviewer||"CinéCritic");
      setFeatured(data.featured||false); setGenre((data.genre||[]).join(", ")); setSelectedOtt([]);
      if (TMDB_API_KEY) {
        const p = await fetchTmdbPoster(data.title||movieSearch, data.year);
        setPoster(p || "");
        if (!p) setError("⚠ TMDb found no poster — paste URL manually if needed");
      }
      setStatus("ready");
    } catch { setError("Groq failed. Check VITE_GROQ_KEY."); setStatus("error"); }
  };

  const handleSave = async () => {
    if (!title || !year || !imdb) { setError("Title, year and IMDb are required."); return; }
    setStatus("saving"); setError("");
    try {
      const fb  = await getFirebase();
      const doc = {
        title, year:parseInt(year), imdb:parseFloat(imdb), director, runtime, rating,
        review, reviewer, featured, poster,
        genre:  genre.split(",").map(g=>g.trim()).filter(Boolean),
        ott:    selectedOtt,
      };
      if (mode === "edit") {
        await fb.updateDoc(fb.doc(fb.fs, "movies", movie.id), doc);
        setMsg("✓ Movie updated!");
      } else {
        await fb.addDoc(fb.collection(fb.fs, "movies"), doc);
        setMsg("✓ Movie added!");
      }
      setStatus("saved");
      setTimeout(() => onBack(), 1500);
    } catch (e) { setError("Save failed: " + e.message); setStatus("ready"); }
  };

  const F = ({ label, value, onChange, type="text", rows }) => (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:"block", color:C.muted, fontSize:9, letterSpacing:1, marginBottom:5 }}>{label}</label>
      {rows
        ? <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows}
            style={{ ...input, resize:"vertical" }} />
        : <input type={type} value={value} onChange={e=>onChange(e.target.value)} style={input} />
      }
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <button onClick={onBack} style={{ ...btn("#1a1a1a","#888"), padding:"6px 12px", fontSize:10, border:`1px solid ${C.border2}` }}>← BACK</button>
        <SectionHeader title={mode==="edit" ? `Editing: ${movie?.title}` : "Add New Movie"} sub="" noMargin />
      </div>

      {/* AI Search (add mode only) */}
      {mode === "add" && (
        <div style={{ ...card, marginBottom:20 }}>
          <p style={{ color:C.muted, fontSize:9, letterSpacing:1, marginBottom:10 }}>AI AUTO-FILL (GROQ + TMDB)</p>
          <div style={{ display:"flex", gap:10 }}>
            <input value={movieSearch} onChange={e=>setMovieSearch(e.target.value)}
              onKeyDown={e=>e.key==="Enter" && handleGenerate()}
              placeholder="Type movie name..." style={{ ...input, flex:1 }} />
            <button onClick={handleGenerate} disabled={status==="loading"}
              style={{ ...btn(), whiteSpace:"nowrap" }}>
              {status==="loading" ? <span className="spin">⟳</span> : "✦ GENERATE"}
            </button>
          </div>
        </div>
      )}

      {(status === "ready" || status === "saving" || status === "saved" || mode==="edit") && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {/* Left column */}
          <div>
            <div style={{ ...card }}>
              <p style={{ color:C.muted, fontSize:9, letterSpacing:1, marginBottom:16 }}>MOVIE DETAILS</p>
              <F label="TITLE"    value={title}    onChange={setTitle} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <F label="YEAR"   value={year}     onChange={setYear}  type="number" />
                <F label="IMDB"   value={imdb}     onChange={setImdb}  type="number" />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <F label="RUNTIME" value={runtime} onChange={setRuntime} />
                <F label="RATING"  value={rating}  onChange={setRating} />
              </div>
              <F label="DIRECTOR" value={director} onChange={setDirector} />
              <F label="GENRES (comma separated)" value={genre} onChange={setGenre} />
              <F label="REVIEWER" value={reviewer} onChange={setReviewer} />
              <F label="REVIEW"   value={review}   onChange={setReview} rows={4} />
              <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:4 }}>
                <input type="checkbox" id="feat" checked={featured} onChange={e=>setFeatured(e.target.checked)}
                  style={{ accentColor:C.yellow, width:14, height:14 }} />
                <label htmlFor="feat" style={{ fontSize:10, color:C.sub, cursor:"pointer" }}>Featured on homepage hero</label>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Poster */}
            <div style={{ ...card, marginBottom:16 }}>
              <p style={{ color:C.muted, fontSize:9, letterSpacing:1, marginBottom:12 }}>POSTER</p>
              {poster && <img src={poster} alt="poster" style={{ width:"100%", maxHeight:220, objectFit:"contain", borderRadius:8, marginBottom:10, background:"#111" }} onError={e=>e.target.style.display="none"} />}
              <input value={poster} onChange={e=>setPoster(e.target.value)} placeholder="https://image.tmdb.org/..." style={input} />
            </div>

            {/* OTT */}
            <div style={{ ...card }}>
              <p style={{ color:C.muted, fontSize:9, letterSpacing:1, marginBottom:12 }}>OTT PLATFORMS</p>
              {ottPlatforms.length === 0
                ? <p style={{ color:"#333", fontSize:10 }}>No platforms in Firebase ott_platforms collection</p>
                : <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                    {ottPlatforms.map(p => {
                      const active = selectedOtt.includes(p.name);
                      return (
                        <div key={p.name} onClick={()=>toggleOtt(p.name)} style={{ cursor:"pointer", textAlign:"center" }}>
                          <div style={{ width:48, height:48, borderRadius:10, border:`2px solid ${active ? C.yellow : C.border2}`,
                            background:"#fff", padding:4, display:"flex", alignItems:"center", justifyContent:"center",
                            boxShadow: active ? `0 0 12px ${C.yellow}44` : "none", transition:"all .15s" }}>
                            <img src={p.image} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"contain" }} onError={e=>e.target.style.opacity="0"} />
                          </div>
                          <p style={{ fontSize:8, color: active ? C.yellow : C.muted, marginTop:3 }}>{p.name}</p>
                        </div>
                      );
                    })}
                  </div>
              }
            </div>
          </div>
        </div>
      )}

      {/* Errors / messages */}
      {error && <div style={{ background:"#1a0000", border:`1px solid #440000`, borderRadius:8, padding:"10px 16px", marginTop:16, fontSize:11, color:C.red }}>{error}</div>}
      {msg   && <div style={{ background:"#001a00", border:`1px solid #004400`, borderRadius:8, padding:"10px 16px", marginTop:16, fontSize:11, color:C.green }}>{msg}</div>}

      {(status === "ready" || status === "saving" || mode==="edit") && (
        <button onClick={handleSave} disabled={status==="saving"}
          style={{ ...btn(), marginTop:20, padding:"12px 32px", fontSize:12, opacity: status==="saving" ? 0.6 : 1 }}>
          {status==="saving" ? <><span className="spin">⟳</span> SAVING...</> : mode==="edit" ? "✓ SAVE CHANGES" : "✓ ADD TO DATABASE"}
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TAB: ANALYTICS
// ═══════════════════════════════════════════════════════════════════════
function AnalyticsTab({ analytics, movies }) {
  const topGenres = Object.entries(
    movies.flatMap(m=>m.genre||[]).reduce((acc,g) => ({ ...acc, [g]:(acc[g]||0)+1 }), {})
  ).sort((a,b)=>b[1]-a[1]).slice(0,8);

  const topRated = [...movies].sort((a,b)=>b.imdb-a.imdb).slice(0,5);
  const byYear   = Object.entries(
    movies.reduce((acc,m) => ({ ...acc, [m.year]:(acc[m.year]||0)+1 }), {})
  ).sort((a,b)=>b[0]-a[0]).slice(0,8);

  const maxGenre = topGenres[0]?.[1] || 1;
  const maxYear  = Math.max(...byYear.map(([,c])=>c), 1);

  return (
    <div>
      <SectionHeader title="Analytics" sub="Site traffic and content statistics" />

      {/* Visit cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        {[
          { label:"Total Visits",  value: analytics.totalVisits, color:C.yellow, icon:"◈" },
          { label:"Today",         value: analytics.todayVisits,  color:C.green,  icon:"▲" },
          { label:"Movies in DB",  value: movies.length,          color:C.blue,   icon:"▤" },
        ].map(s => (
          <div key={s.label} style={{ ...card }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <p style={{ color:C.muted, fontSize:9, letterSpacing:1 }}>{s.label.toUpperCase()}</p>
                <p style={{ fontFamily:display, fontSize:40, color:s.color, marginTop:4 }}>{s.value}</p>
              </div>
              <span style={{ fontSize:24, color:s.color, opacity:.4 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {/* Top Genres */}
        <div style={{ ...card }}>
          <p style={{ color:C.muted, fontSize:9, letterSpacing:1, marginBottom:16 }}>GENRES IN DATABASE</p>
          {topGenres.map(([genre, count]) => (
            <div key={genre} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:10, color:C.sub }}>{genre}</span>
                <span style={{ fontSize:10, color:C.yellow }}>{count}</span>
              </div>
              <div style={{ background:"#1a1a1a", borderRadius:3, height:4, overflow:"hidden" }}>
                <div style={{ width:`${(count/maxGenre)*100}%`, height:"100%", background:C.yellow, borderRadius:3, transition:"width .5s ease" }} />
              </div>
            </div>
          ))}
          {!topGenres.length && <p style={{ color:"#333", fontSize:10 }}>No data yet</p>}
        </div>

        {/* Movies by Year */}
        <div style={{ ...card }}>
          <p style={{ color:C.muted, fontSize:9, letterSpacing:1, marginBottom:16 }}>MOVIES BY YEAR</p>
          {byYear.map(([year, count]) => (
            <div key={year} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:10, color:C.sub }}>{year}</span>
                <span style={{ fontSize:10, color:C.blue }}>{count}</span>
              </div>
              <div style={{ background:"#1a1a1a", borderRadius:3, height:4, overflow:"hidden" }}>
                <div style={{ width:`${(count/maxYear)*100}%`, height:"100%", background:C.blue, borderRadius:3 }} />
              </div>
            </div>
          ))}
          {!byYear.length && <p style={{ color:"#333", fontSize:10 }}>No data yet</p>}
        </div>

        {/* Top Rated */}
        <div style={{ ...card }}>
          <p style={{ color:C.muted, fontSize:9, letterSpacing:1, marginBottom:14 }}>TOP RATED MOVIES</p>
          {topRated.map((m,i) => (
            <div key={m.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <span style={{ fontFamily:display, fontSize:14, color:"#333", width:20 }}>#{i+1}</span>
              {m.poster && <img src={m.poster} style={{ width:24, height:36, objectFit:"cover", borderRadius:3 }} onError={e=>e.target.style.display="none"} />}
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:11, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m.title}</p>
                <p style={{ fontSize:9, color:C.muted }}>{m.year} · {m.director}</p>
              </div>
              <span style={{ fontSize:13, color:C.yellow, fontWeight:700 }}>{m.imdb}</span>
            </div>
          ))}
        </div>

        {/* Analytics note */}
        <div style={{ ...card }}>
          <p style={{ color:C.muted, fontSize:9, letterSpacing:1, marginBottom:12 }}>VISIT TRACKING SETUP</p>
          <p style={{ color:C.sub, fontSize:10, lineHeight:1.7, marginBottom:16 }}>
            To track real visits, add this code to your <span style={{ color:C.yellow }}>App.jsx</span> inside the main component:
          </p>
          <div style={{ background:"#0a0a0a", border:`1px solid ${C.border}`, borderRadius:8, padding:14 }}>
            <pre style={{ fontSize:9, color:"#888", lineHeight:1.8, whiteSpace:"pre-wrap" }}>{`// Paste in App.jsx useEffect
useEffect(() => {
  (async () => {
    const fb = await getFirebase();
    if (!fb) return;
    const today = new Date()
      .toISOString().slice(0,10);
    const ref = fb.doc(
      fb.fs,"analytics","visits");
    await fb.setDoc(ref, {
      total: increment(1),
      [\`daily.\${today}\`]: increment(1)
    }, { merge: true });
  })();
}, []);`}</pre>
          </div>
          <p style={{ color:"#333", fontSize:9, marginTop:10 }}>Then import increment from firebase-firestore</p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TAB: SYSTEM HEALTH
// ═══════════════════════════════════════════════════════════════════════
function SystemTab({ dbStatus }) {
  const [checks, setChecks] = useState({
    firebase: { status:"checking", msg:"" },
    groq:     { status:"checking", msg:"" },
    tmdb:     { status:"checking", msg:"" },
  });
  const [log, setLog] = useState([]);
  const addLog = (msg, type="info") => setLog(p => [{ msg, type, time: new Date().toLocaleTimeString() }, ...p].slice(0,20));

  const runChecks = async () => {
    setChecks({ firebase:{status:"checking",msg:""}, groq:{status:"checking",msg:""}, tmdb:{status:"checking",msg:""} });
    setLog([]);

    // Firebase check
    try {
      addLog("Checking Firebase connection...");
      const fb   = await getFirebase();
      const snap = await Promise.race([
        fb.getDocs(fb.collection(fb.fs, "movies")),
        new Promise((_,r) => setTimeout(() => r(new Error("timeout")), 5000))
      ]);
      setChecks(p => ({ ...p, firebase:{ status:"ok", msg:`${snap.size} movies in DB` } }));
      addLog(`Firebase OK — ${snap.size} documents found`, "ok");
    } catch (e) {
      setChecks(p => ({ ...p, firebase:{ status:"error", msg:e.message } }));
      addLog("Firebase ERROR: " + e.message, "error");
    }

    // Groq check
    try {
      addLog("Checking Groq API...");
      if (!GROQ_API_KEY) throw new Error("VITE_GROQ_KEY not set in .env");
      const res  = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${GROQ_API_KEY}` }
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setChecks(p => ({ ...p, groq:{ status:"ok", msg:"Connected · llama-3.3-70b ready" } }));
      addLog("Groq API OK", "ok");
    } catch (e) {
      setChecks(p => ({ ...p, groq:{ status:"error", msg:e.message } }));
      addLog("Groq ERROR: " + e.message, "error");
    }

    // TMDb check
    try {
      addLog("Checking TMDb API...");
      if (!TMDB_API_KEY) throw new Error("VITE_TMDB_KEY not set in .env");
      const res  = await fetch(`https://api.themoviedb.org/3/configuration?api_key=${TMDB_API_KEY}`);
      const data = await res.json();
      if (data.status_code === 7) throw new Error("Invalid API key");
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setChecks(p => ({ ...p, tmdb:{ status:"ok", msg:"Connected · poster base URL ready" } }));
      addLog("TMDb API OK", "ok");
    } catch (e) {
      setChecks(p => ({ ...p, tmdb:{ status:"error", msg:e.message } }));
      addLog("TMDb ERROR: " + e.message, "error");
    }
  };

  useEffect(() => { runChecks(); }, []);

  const statusColor = (s) => s==="ok" ? C.green : s==="error" ? C.red : C.orange;
  const statusIcon  = (s) => s==="ok" ? "✓" : s==="error" ? "✗" : "…";

  const services = [
    { key:"firebase", label:"Firebase Firestore", icon:"🔥", desc:"Movies, OTT platforms, analytics data" },
    { key:"groq",     label:"Groq AI",            icon:"🧠", desc:"Auto-fill movie details from AI" },
    { key:"tmdb",     label:"TMDb API",            icon:"🎬", desc:"Movie poster images" },
  ];

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <SectionHeader title="System Health" sub="Live status of all connected services" noMargin />
        <button onClick={runChecks} style={{ ...btn(), marginLeft:"auto" }}>↺ RUN CHECKS</button>
      </div>

      {/* Service cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        {services.map(s => {
          const c = checks[s.key];
          return (
            <div key={s.key} style={{ ...card, borderColor: c.status==="ok" ? "#1a3a1a" : c.status==="error" ? "#3a1a1a" : C.border }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <span style={{ fontSize:24 }}>{s.icon}</span>
                <span className={c.status==="checking" ? "pulse" : ""}
                  style={{ width:28, height:28, borderRadius:"50%", background: `${statusColor(c.status)}22`,
                    border:`1px solid ${statusColor(c.status)}`, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:12, color:statusColor(c.status) }}>
                  {statusIcon(c.status)}
                </span>
              </div>
              <p style={{ fontSize:12, color:C.text, marginBottom:4 }}>{s.label}</p>
              <p style={{ fontSize:9, color:C.muted, marginBottom:8 }}>{s.desc}</p>
              <p style={{ fontSize:10, color:statusColor(c.status) }}>
                {c.status==="checking" ? "Checking..." : c.msg || (c.status==="ok" ? "All good" : "Failed")}
              </p>
            </div>
          );
        })}
      </div>

      {/* ENV Variables status */}
      <div style={{ ...card, marginBottom:16 }}>
        <p style={{ color:C.muted, fontSize:9, letterSpacing:1, marginBottom:14 }}>ENVIRONMENT VARIABLES</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
          {[
            { key:"VITE_GROQ_KEY",  val:GROQ_API_KEY, label:"Groq API Key" },
            { key:"VITE_TMDB_KEY",  val:TMDB_API_KEY, label:"TMDb API Key" },
          ].map(v => (
            <div key={v.key} style={{ background:"#0a0a0a", border:`1px solid ${v.val ? "#1a3a1a" : "#3a1a1a"}`, borderRadius:8, padding:"10px 14px" }}>
              <p style={{ fontSize:9, color:C.muted, marginBottom:4 }}>{v.label}</p>
              <p style={{ fontSize:10, color: v.val ? C.green : C.red }}>{v.val ? "✓ SET (" + v.val.slice(0,8) + "...)" : "✗ NOT SET"}</p>
              <p style={{ fontSize:9, color:"#333", marginTop:2 }}>{v.key}</p>
            </div>
          ))}
          <div style={{ background:"#0a0a0a", border:`1px solid ${dbStatus==="live" ? "#1a3a1a" : "#3a1a1a"}`, borderRadius:8, padding:"10px 14px" }}>
            <p style={{ fontSize:9, color:C.muted, marginBottom:4 }}>Firebase</p>
            <p style={{ fontSize:10, color: dbStatus==="live" ? C.green : C.red }}>{dbStatus==="live" ? "✓ CONNECTED" : "✗ " + dbStatus.toUpperCase()}</p>
            <p style={{ fontSize:9, color:"#333", marginTop:2 }}>FIREBASE_CONFIG</p>
          </div>
        </div>
      </div>

      {/* Live log */}
      <div style={{ ...card }}>
        <p style={{ color:C.muted, fontSize:9, letterSpacing:1, marginBottom:12 }}>DIAGNOSTIC LOG</p>
        <div style={{ background:"#050505", borderRadius:8, padding:14, fontFamily:mono, fontSize:10, minHeight:120, maxHeight:240, overflow:"auto" }}>
          {log.length === 0
            ? <span style={{ color:"#222" }}>Running checks...</span>
            : log.map((l,i) => (
              <div key={i} style={{ marginBottom:4, color: l.type==="ok" ? C.green : l.type==="error" ? C.red : C.muted }}>
                <span style={{ color:"#333" }}>[{l.time}]</span> {l.msg}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// TAB: OTT MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════
function OttTab({ ottPlatforms, setOttPlatforms }) {
  const [name,   setName]   = useState("");
  const [image,  setImage]  = useState("");
  const [order,  setOrder]  = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting,setDeleting]=useState(null);
  const [msg,    setMsg]    = useState("");
  const [error,  setError]  = useState("");

  const handleAdd = async () => {
    if (!name || !image) { setError("Name and image URL are required"); return; }
    setSaving(true); setError("");
    try {
      const fb  = await getFirebase();
      const ref = await fb.addDoc(fb.collection(fb.fs, "ott_platforms"), {
        name, image, order: parseInt(order)||99
      });
      const newPlatform = { id:ref.id, name, image, order:parseInt(order)||99 };
      setOttPlatforms(p => [...p, newPlatform].sort((a,b)=>(a.order||99)-(b.order||99)));
      setName(""); setImage(""); setOrder("");
      setMsg("✓ Platform added!");
      setTimeout(() => setMsg(""), 3000);
    } catch (e) { setError("Failed: " + e.message); }
    setSaving(false);
  };

  const handleDelete = async (platform) => {
    if (!window.confirm(`Delete "${platform.name}"?`)) return;
    setDeleting(platform.id);
    try {
      const fb = await getFirebase();
      await fb.deleteDoc(fb.doc(fb.fs, "ott_platforms", platform.id));
      setOttPlatforms(p => p.filter(x => x.id !== platform.id));
      setMsg("✓ Platform removed");
      setTimeout(() => setMsg(""), 3000);
    } catch { setMsg("❌ Delete failed"); }
    setDeleting(null);
  };

  return (
    <div>
      <SectionHeader title="OTT Platforms" sub="Manage streaming platform logos — no code changes needed" />

      {/* Add new */}
      <div style={{ ...card, marginBottom:20 }}>
        <p style={{ color:C.muted, fontSize:9, letterSpacing:1, marginBottom:14 }}>ADD NEW PLATFORM</p>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 4fr 1fr auto", gap:10, alignItems:"end" }}>
          <div>
            <label style={{ display:"block", color:C.muted, fontSize:9, letterSpacing:1, marginBottom:5 }}>NAME</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Netflix" style={input} />
          </div>
          <div>
            <label style={{ display:"block", color:C.muted, fontSize:9, letterSpacing:1, marginBottom:5 }}>IMAGE URL</label>
            <input value={image} onChange={e=>setImage(e.target.value)} placeholder="https://... or data:image/..." style={input} />
          </div>
          <div>
            <label style={{ display:"block", color:C.muted, fontSize:9, letterSpacing:1, marginBottom:5 }}>ORDER</label>
            <input value={order} onChange={e=>setOrder(e.target.value)} type="number" placeholder="1" style={input} />
          </div>
          <button onClick={handleAdd} disabled={saving} style={{ ...btn(), height:36, whiteSpace:"nowrap" }}>
            {saving ? <span className="spin">⟳</span> : "+ ADD"}
          </button>
        </div>
        {error && <p style={{ color:C.red, fontSize:10, marginTop:10 }}>{error}</p>}
        {msg   && <p style={{ color:C.green, fontSize:10, marginTop:10 }}>{msg}</p>}
      </div>

      {/* Current platforms */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12 }}>
        {ottPlatforms.map(p => (
          <div key={p.id} style={{ ...card, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:44, height:44, background:"#fff", borderRadius:8, padding:4, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <img src={p.image} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"contain" }} onError={e=>e.target.style.opacity="0"} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:11, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.name}</p>
              <p style={{ fontSize:9, color:C.muted }}>order: {p.order||"—"}</p>
            </div>
            <button onClick={()=>handleDelete(p)} disabled={deleting===p.id}
              style={{ ...btn(C.red,"#fff"), padding:"4px 8px", fontSize:9, flexShrink:0, opacity:deleting===p.id?.5:1 }}>
              ✗
            </button>
          </div>
        ))}
        {ottPlatforms.length === 0 && (
          <div style={{ ...card, gridColumn:"1/-1", textAlign:"center", color:C.muted, fontSize:11, padding:40 }}>
            No OTT platforms yet. Add your first one above.
          </div>
        )}
      </div>
    </div>
  );
}

// ── SHARED COMPONENTS ─────────────────────────────────────────────────
function SectionHeader({ title, sub, noMargin }) {
  return (
    <div style={{ marginBottom: noMargin ? 0 : 20 }}>
      <h2 style={{ fontFamily:display, fontSize:22, letterSpacing:2, color:C.text }}>{title.toUpperCase()}</h2>
      {sub && <p style={{ color:C.muted, fontSize:10, marginTop:3 }}>{sub}</p>}
    </div>
  );
}
