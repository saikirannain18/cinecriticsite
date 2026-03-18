import React, { useState, useEffect } from 'react';
import { getFirebase } from '../../services/firebase';
import { C, mono, display, btn } from '../../utils/adminStyles';
import { OverviewTab } from './tabs/OverviewTab';
import { MoviesTab } from './tabs/MoviesTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { SystemTab } from './tabs/SystemTab';
import { OttTab } from './tabs/OttTab';

function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setW(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return w;
}

const TABS = [
  { id:"overview",  label:"Overview",      icon:"◈" },
  { id:"movies",    label:"Movies",        icon:"▤" },
  { id:"analytics", label:"Analytics",     icon:"▲" },
  { id:"system",    label:"System Health", icon:"◉" },
  { id:"ott",       label:"OTT Platforms", icon:"◎" },
];

export function AdminDashboard({ admin, onLogout }) {
  const [tab,       setTab]       = useState("overview");
  const [movies,    setMovies]    = useState([]);
  const [ottPlatforms, setOttPlatforms] = useState([]);
  const [analytics, setAnalytics] = useState({ totalVisits:0, todayVisits:0, topMovies:[] });
  const [dbStatus,  setDbStatus]  = useState("checking");
  const [navOpen,   setNavOpen]   = useState(false); // mobile sidebar toggle
  const isMobile = useWindowWidth() < 768;

  // Close nav when tab changes on mobile
  const changeTab = (id) => { setTab(id); if (isMobile) setNavOpen(false); };

  useEffect(() => {
    (async () => {
      try {
        const fb = await getFirebase();
        fb.onSnapshot(fb.collection(fb.fs, "movies"), snap => {
          // Sort newest first
          const mv = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          mv.sort((a,b) => b.year - a.year);
          setMovies(mv);
          setDbStatus("live");
        }, () => setDbStatus("error"));
      } catch { setDbStatus("error"); }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const fb   = await getFirebase();
        const snap = await fb.getDocs(fb.collection(fb.fs, "ott_platforms"));
        setOttPlatforms(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b)=>(a.order||99)-(b.order||99)));
      } catch { /* ignore */ }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const fb   = await getFirebase();
        const snap = await fb.getDocs(fb.collection(fb.fs, "analytics"));
        const data = {};
        snap.docs.forEach(d => { data[d.id] = d.data(); });
        const today = new Date().toISOString().slice(0,10);
        setAnalytics({ totalVisits: data.visits?.total||0, todayVisits: data.visits?.daily?.[today]||0, topMovies: data.topMovies?.list||[] });
      } catch { /* ignore */ }
    })();
  }, []);

  const activeTab = TABS.find(t => t.id === tab);

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      {/* ── TOP BAR ── */}
      <header style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 16px", height:52, display:"flex", alignItems:"center", gap:12, flexShrink:0, position:"sticky", top:0, zIndex:100 }}>
        {/* Hamburger (mobile only) */}
        {isMobile && (
          <button onClick={() => setNavOpen(o => !o)}
            style={{ background:"none", border:"none", cursor:"pointer", padding:6, display:"flex", flexDirection:"column", gap:4 }}>
            <span style={{ display:"block", width:20, height:2, background: navOpen ? C.yellow : C.sub, borderRadius:2, transition:"all .2s", transform: navOpen ? "rotate(45deg) translateY(6px)" : "none" }} />
            <span style={{ display:"block", width:20, height:2, background: navOpen ? "transparent" : C.sub, borderRadius:2, transition:"all .2s" }} />
            <span style={{ display:"block", width:20, height:2, background: navOpen ? C.yellow : C.sub, borderRadius:2, transition:"all .2s", transform: navOpen ? "rotate(-45deg) translateY(-6px)" : "none" }} />
          </button>
        )}

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:26, height:26, background:C.yellow, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>🎬</div>
          <span style={{ fontFamily:display, fontSize:16, letterSpacing:2 }}>CINE<span style={{color:C.yellow}}>CRITIC</span></span>
          {!isMobile && <span style={{ color:"#333", fontSize:10, marginLeft:2 }}>/ ADMIN</span>}
        </div>

        {/* Right side */}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:isMobile?8:14 }}>
          {/* DB pill */}
          <div style={{ display:"flex", alignItems:"center", gap:5, background:"#0a0a0a", border:`1px solid ${C.border2}`, borderRadius:20, padding:"3px 10px" }}>
            <span className={dbStatus==="checking"?"pulse":""} style={{ width:6, height:6, borderRadius:"50%", background: dbStatus==="live"?C.green:dbStatus==="error"?C.red:C.orange, display:"inline-block" }} />
            {!isMobile && <span style={{ fontSize:9, color: dbStatus==="live"?C.green:dbStatus==="error"?C.red:C.orange, letterSpacing:1 }}>
              {dbStatus==="live"?"DB LIVE":dbStatus==="error"?"DB ERROR":"CONNECTING"}
            </span>}
          </div>
          {!isMobile && <span style={{ color:C.sub, fontSize:10 }}>{admin.name}</span>}
          <button onClick={onLogout} style={{ ...btn("#1a1a1a","#888"), padding:"5px 10px", fontSize:9, border:`1px solid ${C.border2}` }}>
            {isMobile ? "✕" : "LOGOUT"}
          </button>
          <a href="/" style={{ ...btn("#F5C518","#000"), padding:"5px 10px", textDecoration:"none", fontSize:9, border:`1px solid ${C.border2}` }}>
             LIVE SITE
          </a>
        </div>
      </header>

      <div style={{ display:"flex", flex:1, overflow:"hidden", position:"relative" }}>
        {/* ── MOBILE OVERLAY ── */}
        {isMobile && navOpen && (
          <div onClick={() => setNavOpen(false)}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:49, top:52 }} />
        )}

        {/* ── SIDEBAR ── */}
        <nav style={{
          width: 200,
          background: C.surface,
          borderRight: `1px solid ${C.border}`,
          padding: "16px 0",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          // Mobile: slide in/out
          ...(isMobile ? {
            position: "fixed", top:52, left:0, bottom:0, zIndex:50,
            transform: navOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform .25s ease",
            boxShadow: navOpen ? "4px 0 20px rgba(0,0,0,0.5)" : "none",
          } : {})
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => changeTab(t.id)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 20px",
                background: tab===t.id ? "#F5C51815" : "transparent",
                borderLeft: tab===t.id ? `2px solid ${C.yellow}` : "2px solid transparent",
                border:"none", borderRight:"none", cursor:"pointer", width:"100%", textAlign:"left",
                color: tab===t.id ? C.yellow : C.sub, fontSize:11, letterSpacing:1, fontFamily:mono }}>
              <span style={{ fontSize:15, width:18 }}>{t.icon}</span>
              {t.label.toUpperCase()}
            </button>
          ))}

          {/* Quick stats */}
          <div style={{ marginTop:"auto", padding:"16px 20px", borderTop:`1px solid ${C.border}` }}>
            <p style={{ color:"#222", fontSize:9, letterSpacing:1, marginBottom:8 }}>QUICK STATS</p>
            <p style={{ color:C.muted, fontSize:10 }}><span style={{color:C.yellow}}>{movies.length}</span> movies</p>
            <p style={{ color:C.muted, fontSize:10, marginTop:4 }}><span style={{color:C.yellow}}>{movies.filter(m=>m.featured).length}</span> featured</p>
            <p style={{ color:C.muted, fontSize:10, marginTop:4 }}><span style={{color:C.yellow}}>{ottPlatforms.length}</span> platforms</p>
          </div>
        </nav>

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex:1, overflow:"auto", padding: isMobile ? 14 : 24, ...(isMobile?{}:{}) }}>
          {/* Mobile tab title */}
          {isMobile && (
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <span style={{ fontSize:18, color:C.yellow }}>{activeTab?.icon}</span>
              <h2 style={{ fontFamily:display, fontSize:16, letterSpacing:2 }}>{activeTab?.label?.toUpperCase()}</h2>
            </div>
          )}
          <div className="fade-in" key={tab}>
            {tab==="overview"  && <OverviewTab  movies={movies} analytics={analytics} dbStatus={dbStatus} isMobile={isMobile} />}
            {tab==="movies"    && <MoviesTab    movies={movies} ottPlatforms={ottPlatforms} isMobile={isMobile} />}
            {tab==="analytics" && <AnalyticsTab analytics={analytics} movies={movies} isMobile={isMobile} />}
            {tab==="system"    && <SystemTab    dbStatus={dbStatus} isMobile={isMobile} />}
            {tab==="ott"       && <OttTab       ottPlatforms={ottPlatforms} setOttPlatforms={setOttPlatforms} isMobile={isMobile} />}
          </div>
        </main>
      </div>
    </div>
  );
}
