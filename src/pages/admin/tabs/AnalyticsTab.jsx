import React from 'react';
import { C, card, display, SectionHeader } from '../../../utils/adminStyles';

export function AnalyticsTab({ analytics, movies, isMobile }) {
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
      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap:12, marginBottom:24 }}>
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

      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:16 }}>
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
