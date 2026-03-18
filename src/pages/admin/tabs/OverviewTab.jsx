import React from 'react';
import { C, card, display, SectionHeader } from '../../../utils/adminStyles';

export function OverviewTab({ movies, analytics, isMobile }) {
  const featured = movies.filter(m => m.featured).length;
  const avgImdb  = movies.length ? (movies.reduce((s,m) => s+(m.imdb||0),0)/movies.length).toFixed(1) : "—";
  const genres   = [...new Set(movies.flatMap(m => m.genre||[]))].length;

  const statCards = [
    { label:"Total Movies",  value:movies.length,         color:C.yellow },
    { label:"Featured",      value:featured,              color:C.blue   },
    { label:"Avg IMDb",      value:avgImdb,               color:C.green  },
    { label:"Genres",        value:genres,                color:C.orange },
    { label:"Today Visits",  value:analytics.todayVisits, color:"#a855f7"},
    { label:"Total Visits",  value:analytics.totalVisits, color:"#ec4899"},
  ];

  const recentMovies = [...movies].slice(0, 5); // Movies are already sorted newest first

  return (
    <div>
      {!isMobile && <SectionHeader title="Overview" sub="Your site at a glance" />}

      {/* Stat cards — 2 col on mobile, 3 on tablet, 6 on desktop */}
      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap:10, marginBottom:24 }}>
        {statCards.map(s => (
          <div key={s.label} style={{ ...card, padding: isMobile ? 14 : 20 }}>
            <p style={{ color:C.muted, fontSize:8, letterSpacing:1 }}>{s.label.toUpperCase()}</p>
            <p style={{ fontFamily:display, fontSize: isMobile ? 26 : 32, color:s.color, marginTop:4 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent movies */}
      <SectionHeader title="Recent Movies" sub="Last 5 added" />

      {isMobile ? (
        // Mobile: card list
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {recentMovies.map(m => (
            <div key={m.id} style={{ ...card, display:"flex", gap:12, padding:12 }}>
              {m.poster
                ? <img src={m.poster} style={{ width:36, height:54, objectFit:"cover", borderRadius:4, flexShrink:0 }} onError={e=>e.target.style.display="none"} />
                : <div style={{ width:36, height:54, background:"#1a1a1a", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>?</div>
              }
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:12, color:C.text, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m.title}</p>
                <p style={{ fontSize:10, color:C.sub, marginTop:2 }}>{m.year} · {m.director}</p>
                <div style={{ display:"flex", gap:8, marginTop:4, alignItems:"center" }}>
                  <span style={{ fontSize:11, color:C.yellow, fontWeight:700 }}>★ {m.imdb}</span>
                  {m.featured && <span style={{ fontSize:8, background:"#F5C51820", color:C.yellow, padding:"1px 6px", borderRadius:3 }}>FEATURED</span>}
                </div>
              </div>
            </div>
          ))}
          {!recentMovies.length && <p style={{ color:C.muted, fontSize:11, textAlign:"center", padding:20 }}>No movies yet</p>}
        </div>
      ) : (
        // Desktop: table
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
              {recentMovies.map(m => (
                <tr key={m.id} style={{ borderBottom:`1px solid ${C.border}` }}>
                  <td style={{ padding:"10px 16px", fontSize:11, color:C.text }}>{m.title}</td>
                  <td style={{ padding:"10px 16px", fontSize:11, color:C.sub }}>{m.year}</td>
                  <td style={{ padding:"10px 16px", fontSize:12, color:C.yellow }}>{m.imdb}</td>
                  <td style={{ padding:"10px 16px", fontSize:11, color:C.sub }}>{m.director}</td>
                  <td style={{ padding:"10px 16px" }}>
                    {m.featured && <span style={{ background:"#F5C51820", color:C.yellow, fontSize:9, padding:"2px 8px", borderRadius:4 }}>★ YES</span>}
                  </td>
                </tr>
              ))}
              {!recentMovies.length && (
                <tr><td colSpan={5} style={{ padding:24, textAlign:"center", color:C.muted, fontSize:11 }}>No movies yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
