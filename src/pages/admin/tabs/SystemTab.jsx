import React, { useState, useEffect } from 'react';
import { getFirebase } from '../../../services/firebase';
import { C, card, btn, mono, SectionHeader } from '../../../utils/adminStyles';

const GROQ_API_KEY = import.meta.env.VITE_MODAL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB;

export function SystemTab({ dbStatus, isMobile }) {
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap:12, marginBottom:24 }}>
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
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap:10 }}>
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
