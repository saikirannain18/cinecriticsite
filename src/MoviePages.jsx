// Auto-upgrades TMDb poster quality
function getPoster(url) {
  if (!url) return "";
  return url.replace("/t/p/w500/", "/t/p/w1280/")
            .replace("/t/p/w342/", "/t/p/w1280/")
            .replace("/t/p/w185/", "/t/p/w1280/")
}

// ─────────────────────────────────────────────────────────────────────
// MoviePages.jsx
// All pages receive filter state FROM the parent App.
// Selecting a filter here = updates sidebar too, and vice versa.
// ─────────────────────────────────────────────────────────────────────

import { useState } from "react";

// ── SHARED UI ─────────────────────────────────────────────────────────
const ImdbBadge = ({ score }) => (
  <div style={{ display:"flex", alignItems:"center", gap:4, background:"#F5C518", borderRadius:4, padding:"2px 7px", flexShrink:0 }}>
    <span style={{ fontFamily:"'Anton',sans-serif", fontSize:8, color:"#000", letterSpacing:1 }}>IMDb</span>
    <span style={{ fontFamily:"'Anton',sans-serif", fontSize:11, color:"#000", fontWeight:700 }}>{score}</span>
  </div>
);

const StarRating = ({ score }) => {
  const filled = Math.round(score / 2);
  return (
    <div style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(s=>(
        <svg key={s} width="10" height="10" viewBox="0 0 24 24"
          fill={s<=filled?"#F5C518":"none"} stroke="#F5C518" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
};

// ── GENRE FILTER BAR ─────────────────────────────────────────────────
const GenreBar = ({ genres, selected, onSelect }) => (
  <div style={{ overflowX:"auto", paddingBottom:6, marginBottom:16 }}>
    <div style={{ display:"flex", gap:7, minWidth:"max-content" }}>
      {["All", ...genres].map(g=>(
        <button key={g} onClick={()=>onSelect(g)} style={{
          background:  selected===g ? "#F5C518" : "#141414",
          color:       selected===g ? "#000"     : "#888",
          border:      selected===g ? "none"     : "1px solid #222",
          borderRadius:20, padding:"6px 14px", cursor:"pointer",
          fontFamily:"'Space Mono',monospace", fontSize:10,
          fontWeight: selected===g ? 700 : 400,
          whiteSpace:"nowrap", transition:"all 0.2s", flexShrink:0,
        }}>{g}</button>
      ))}
    </div>
  </div>
);

// ── YEAR FILTER BAR ───────────────────────────────────────────────────
const YearBar = ({ years, selected, onSelect, accentColor="#4caf50" }) => (
  <div style={{ overflowX:"auto", paddingBottom:4, marginBottom:16 }}>
    <div style={{ display:"flex", gap:6, minWidth:"max-content" }}>
      {["All", ...years].map(y=>(
        <button key={y} onClick={()=>onSelect(y)} style={{
          background:  selected===y ? accentColor : "#141414",
          color:       selected===y ? "#000"       : "#666",
          border:      selected===y ? "none"        : "1px solid #222",
          borderRadius:6, padding:"5px 12px", cursor:"pointer",
          fontFamily:"'Space Mono',monospace", fontSize:10,
          fontWeight: selected===y ? 700 : 400,
          whiteSpace:"nowrap", transition:"all 0.2s", flexShrink:0,
        }}>{y}</button>
      ))}
    </div>
  </div>
);

// ── ACTIVE FILTER PILLS ───────────────────────────────────────────────
const ActiveFilters = ({ selectedGenre, selectedYear, selectedRating, onClear }) => {
  const active = [
    selectedGenre  !== "All" && `Genre: ${selectedGenre}`,
    selectedYear   !== "All" && `Year: ${selectedYear}`,
    selectedRating !== "All" && `IMDb: ${selectedRating}`,
  ].filter(Boolean);
  if (!active.length) return null;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:14 }}>
      <span style={{ color:"#555", fontSize:9, fontFamily:"'Space Mono',monospace" }}>ACTIVE:</span>
      {active.map(f=>(
        <span key={f} style={{ background:"#F5C51815", border:"1px solid #F5C51840",
          color:"#F5C518", borderRadius:20, padding:"3px 10px",
          fontSize:9, fontFamily:"'Space Mono',monospace" }}>{f}</span>
      ))}
      <button onClick={onClear} style={{ background:"none", border:"1px solid #2a2a2a",
        color:"#666", borderRadius:20, padding:"3px 10px",
        fontSize:9, fontFamily:"'Space Mono',monospace", cursor:"pointer" }}>Clear ✕</button>
    </div>
  );
};

// ── MOVIE ROW (ranked) ────────────────────────────────────────────────
const MovieRow = ({ movie, rank, onClick, accentColor="#F5C518" }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={()=>onClick(movie)}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 14px",
        borderRadius:8, cursor:"pointer", transition:"background 0.2s",
        background:hov?"#141414":"transparent", borderBottom:"1px solid #0f0f0f" }}>
      <div style={{ width:36, flexShrink:0, textAlign:"center" }}>
        <span style={{ fontFamily:"'Anton',sans-serif",
          fontSize:rank<=10?22:rank<=50?18:14,
          color:rank===1?"#F5C518":rank<=3?"#aaa":"#2a2a2a" }}>{rank}</span>
      </div>
      <img src={getPoster(movie.poster)} alt={movie.title}
        style={{ width:44, height:66, objectFit:"cover", display:"block", WebkitBackfaceVisibility:"hidden", backfaceVisibility:"hidden", borderRadius:6, flexShrink:0 }}
        onError={e=>{e.target.src=`https://placehold.co/44x66/1a1a1a/F5C518?text=?`;}}/>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontFamily:"'Anton',sans-serif", fontSize:14, color:"#fff",
          margin:"0 0 3px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{movie.title}</p>
        <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4, flexWrap:"wrap" }}>
          <span style={{ color:accentColor, fontFamily:"'Space Mono',monospace", fontSize:9 }}>{movie.year}</span>
          <span style={{ color:"#333" }}>·</span>
          <span style={{ color:"#555", fontSize:9 }}>Dir. {movie.director}</span>
        </div>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {(movie.genre||[]).slice(0,2).map(g=>(
            <span key={g} style={{ background:"#1a1a1a", border:"1px solid #222", borderRadius:20,
              padding:"1px 7px", fontSize:8, color:"#666", fontFamily:"'Space Mono',monospace" }}>{g}</span>
          ))}
        </div>
      </div>
      <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
        <ImdbBadge score={movie.imdb}/>
        <StarRating score={movie.imdb}/>
      </div>
    </div>
  );
};

// ── MOVIE CARD (grid) ─────────────────────────────────────────────────
const MovieCard = ({ movie, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={()=>onClick(movie)}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ borderRadius:10, overflow:"hidden", background:"#141414", cursor:"pointer",
        border:hov?"1px solid #F5C518":"1px solid #1e1e1e",
        transform:hov?"translateY(-4px)":"none", transition:"all 0.25s ease",
        boxShadow:hov?"0 14px 32px rgba(245,197,24,0.15)":"none" }}>
      <div style={{ position:"relative", aspectRatio:"2/3", overflow:"hidden" }}>
        <img src={getPoster(movie.poster)} alt={movie.title}
          style={{ width:"100%", height:"100%", objectFit:"cover",
            transform:hov?"scale(1.06)":"scale(1)", transition:"transform 0.35s ease" }}
          onError={e=>{e.target.src=`https://placehold.co/300x450/1a1a1a/F5C518?text=${encodeURIComponent(movie.title)}`;}}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 55%)" }}/>
        <div style={{ position:"absolute", top:7, right:7 }}><ImdbBadge score={movie.imdb}/></div>
      </div>
      <div style={{ padding:"9px 11px 10px" }}>
        <h3 style={{ margin:"0 0 3px", color:"#fff", fontSize:12, fontFamily:"'Anton',sans-serif",
          whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{movie.title}</h3>
        <span style={{ color:"#F5C518", fontSize:9, fontFamily:"'Space Mono',monospace" }}>{movie.year}</span>
      </div>
    </div>
  );
};

// ── PAGE WRAPPER ──────────────────────────────────────────────────────
const PageWrapper = ({ title, subtitle, icon, accentColor, children }) => (
  <div style={{ animation:"fadeIn 0.3s ease" }}>
    <div style={{ paddingBottom:18, marginBottom:20, borderBottom:"1px solid #141414" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:5 }}>
        <span style={{ fontSize:26 }}>{icon}</span>
        <h1 style={{ fontFamily:"'Anton',sans-serif", fontSize:26, letterSpacing:2, color:accentColor, margin:0 }}>{title}</h1>
      </div>
      <p style={{ color:"#444", fontSize:10, fontFamily:"'Space Mono',monospace", margin:0, paddingLeft:38 }}>{subtitle}</p>
    </div>
    {children}
  </div>
);

// ── SHARED FILTER FUNCTION ────────────────────────────────────────────
function applyFilters(movies, selectedGenre, selectedYear, selectedRating) {
  return movies.filter(m => {
    if (selectedGenre  !== "All" && !(m.genre||[]).includes(selectedGenre)) return false;
    if (selectedYear   !== "All" && String(m.year) !== selectedYear)        return false;
    if (selectedRating !== "All" && m.imdb < parseFloat(selectedRating))    return false;
    return true;
  });
}

// ─────────────────────────────────────────────────────────────────────
// PAGE 1 — TOP 250
// ─────────────────────────────────────────────────────────────────────
export const Top250Page = ({ movies, onMovieClick, isMobile,
  selectedGenre, setSelectedGenre, selectedYear, setSelectedYear,
  selectedRating, setSelectedRating }) => {

  const genres  = [...new Set(movies.flatMap(m=>m.genre||[]))].sort();
  const clearAll = ()=>{ setSelectedGenre("All"); setSelectedYear("All"); setSelectedRating("All"); };
  const ranked  = applyFilters([...movies].sort((a,b)=>b.imdb-a.imdb).slice(0,250), selectedGenre, selectedYear, selectedRating);

  return (
    <PageWrapper title="TOP 250 MOVIES" subtitle="Highest rated films — ranked by IMDb score" icon="🏆" accentColor="#F5C518">
      <GenreBar genres={genres} selected={selectedGenre} onSelect={setSelectedGenre}/>
      <ActiveFilters selectedGenre={selectedGenre} selectedYear={selectedYear} selectedRating={selectedRating} onClear={clearAll}/>
      <div style={{ display:"flex", gap:20, marginBottom:16, padding:"10px 14px", background:"#0d0d0d", borderRadius:10, border:"1px solid #1a1a1a" }}>
        <div><p style={{ color:"#333", fontSize:7, fontFamily:"'Space Mono',monospace", letterSpacing:2, margin:"0 0 2px" }}>SHOWING</p>
          <p style={{ color:"#F5C518", fontFamily:"'Anton',sans-serif", fontSize:18, margin:0 }}>{ranked.length}</p></div>
        <div><p style={{ color:"#333", fontSize:7, fontFamily:"'Space Mono',monospace", letterSpacing:2, margin:"0 0 2px" }}>TOP SCORE</p>
          <p style={{ color:"#fff", fontFamily:"'Anton',sans-serif", fontSize:18, margin:0 }}>{ranked[0]?.imdb||"—"}</p></div>
      </div>
      <div style={{ background:"#0a0a0a", borderRadius:12, border:"1px solid #141414", overflow:"hidden" }}>
        {ranked.length===0
          ? <div style={{ textAlign:"center", padding:"48px 0", color:"#333" }}><div style={{ fontSize:32, marginBottom:10 }}>🎬</div><p style={{ fontFamily:"'Lora',serif" }}>No movies match your filters.</p></div>
          : ranked.map((m,i)=><MovieRow key={m.id} movie={m} rank={i+1} onClick={onMovieClick} accentColor="#F5C518"/>)}
      </div>
    </PageWrapper>
  );
};

// ─────────────────────────────────────────────────────────────────────
// PAGE 2 — MOST POPULAR
// ─────────────────────────────────────────────────────────────────────
export const MostPopularPage = ({ movies, onMovieClick, isMobile,
  selectedGenre, setSelectedGenre, selectedYear, setSelectedYear,
  selectedRating, setSelectedRating }) => {

  const genres  = [...new Set(movies.flatMap(m=>m.genre||[]))].sort();
  const clearAll = ()=>{ setSelectedGenre("All"); setSelectedYear("All"); setSelectedRating("All"); };
  const popular = applyFilters(
    [...movies].map(m=>({...m,_pop:m.imdb+Math.max(0,(m.year-2000)*0.05)})).sort((a,b)=>b._pop-a._pop),
    selectedGenre, selectedYear, selectedRating
  );

  return (
    <PageWrapper title="MOST POPULAR" subtitle="Trending picks — ranked by popularity score" icon="🌟" accentColor="#a78bfa">
      <GenreBar genres={genres} selected={selectedGenre} onSelect={setSelectedGenre}/>
      <ActiveFilters selectedGenre={selectedGenre} selectedYear={selectedYear} selectedRating={selectedRating} onClear={clearAll}/>
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(auto-fill,minmax(155px,1fr))", gap:isMobile?10:14 }}>
        {popular.length===0
          ? <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"48px 0", color:"#333" }}><div style={{ fontSize:32, marginBottom:10 }}>🎬</div><p style={{ fontFamily:"'Lora',serif" }}>No movies match your filters.</p></div>
          : popular.map(m=><MovieCard key={m.id} movie={m} onClick={onMovieClick}/>)}
      </div>
    </PageWrapper>
  );
};

// ─────────────────────────────────────────────────────────────────────
// PAGE 3 — NEW RELEASES
// ─────────────────────────────────────────────────────────────────────
export const NewReleasesPage = ({ movies, onMovieClick, isMobile,
  selectedGenre, setSelectedGenre, selectedYear, setSelectedYear,
  selectedRating, setSelectedRating }) => {

  const genres  = [...new Set(movies.flatMap(m=>m.genre||[]))].sort();
  const years   = [...new Set(movies.map(m=>String(m.year)))].sort((a,b)=>b-a);
  const clearAll = ()=>{ setSelectedGenre("All"); setSelectedYear("All"); setSelectedRating("All"); };

  const sorted  = applyFilters([...movies].sort((a,b)=>b.year-a.year), selectedGenre, selectedYear, selectedRating);
  const grouped = sorted.reduce((acc,m)=>{ const y=String(m.year); if(!acc[y])acc[y]=[]; acc[y].push(m); return acc; },{});

  return (
    <PageWrapper title="NEW RELEASES" subtitle="Sorted by release year — newest first" icon="🆕" accentColor="#4caf50">
      <GenreBar genres={genres} selected={selectedGenre} onSelect={setSelectedGenre}/>
      <YearBar  years={years}   selected={selectedYear}  onSelect={setSelectedYear} accentColor="#4caf50"/>
      <ActiveFilters selectedGenre={selectedGenre} selectedYear={selectedYear} selectedRating={selectedRating} onClear={clearAll}/>
      {Object.keys(grouped).length===0
        ? <div style={{ textAlign:"center", padding:"48px 0", color:"#333" }}><div style={{ fontSize:32, marginBottom:10 }}>🎬</div><p style={{ fontFamily:"'Lora',serif" }}>No movies match your filters.</p></div>
        : Object.entries(grouped).map(([year,ym])=>(
          <div key={year} style={{ marginBottom:28 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <div style={{ background:"#4caf5020", border:"1px solid #4caf5040", borderRadius:7, padding:"3px 12px" }}>
                <span style={{ fontFamily:"'Anton',sans-serif", fontSize:17, color:"#4caf50" }}>{year}</span>
              </div>
              <span style={{ color:"#333", fontSize:9, fontFamily:"'Space Mono',monospace" }}>{ym.length} film{ym.length!==1?"s":""}</span>
              <div style={{ flex:1, height:1, background:"#111" }}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(auto-fill,minmax(155px,1fr))", gap:isMobile?10:14 }}>
              {ym.map(m=><MovieCard key={m.id} movie={m} onClick={onMovieClick}/>)}
            </div>
          </div>
        ))}
    </PageWrapper>
  );
};

// ─────────────────────────────────────────────────────────────────────
// PAGE 4 — RELEASE CALENDAR
// ─────────────────────────────────────────────────────────────────────
export const ReleaseCalendarPage = ({ movies, onMovieClick, isMobile,
  selectedGenre, setSelectedGenre, selectedYear, setSelectedYear,
  selectedRating, setSelectedRating }) => {

  const genres   = [...new Set(movies.flatMap(m=>m.genre||[]))].sort();
  const clearAll = ()=>{ setSelectedGenre("All"); setSelectedYear("All"); setSelectedRating("All"); };
  const filtered = applyFilters([...movies].sort((a,b)=>b.year-a.year), selectedGenre, selectedYear, selectedRating);
  const decades  = filtered.reduce((acc,m)=>{ const l=`${Math.floor(m.year/10)*10}s`; if(!acc[l])acc[l]=[]; acc[l].push(m); return acc; },{});
  const colors   = {"2020s":"#F5C518","2010s":"#4caf50","2000s":"#a78bfa","1990s":"#f97316","1980s":"#ec4899","1970s":"#06b6d4"};

  return (
    <PageWrapper title="RELEASE CALENDAR" subtitle="Browse your collection by era and decade" icon="📅" accentColor="#F5C518">
      <GenreBar genres={genres} selected={selectedGenre} onSelect={setSelectedGenre}/>
      <ActiveFilters selectedGenre={selectedGenre} selectedYear={selectedYear} selectedRating={selectedRating} onClear={clearAll}/>
      {Object.keys(decades).length===0
        ? <div style={{ textAlign:"center", padding:"48px 0", color:"#333" }}><div style={{ fontSize:32, marginBottom:10 }}>📅</div><p style={{ fontFamily:"'Lora',serif" }}>No movies match your filters.</p></div>
        : Object.entries(decades).map(([decade,dm])=>{
          const c=colors[decade]||"#888";
          return (
            <div key={decade} style={{ marginBottom:32 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
                <div style={{ background:`${c}15`, border:`1px solid ${c}40`, borderRadius:9, padding:"5px 16px" }}>
                  <span style={{ fontFamily:"'Anton',sans-serif", fontSize:20, color:c, letterSpacing:2 }}>{decade}</span>
                </div>
                <span style={{ color:"#333", fontSize:9, fontFamily:"'Space Mono',monospace" }}>
                  {dm.length} film{dm.length!==1?"s":""} · {dm[dm.length-1].year}–{dm[0].year}
                </span>
                <div style={{ flex:1, height:1, background:"#111" }}/>
              </div>
              <div style={{ background:"#0a0a0a", borderRadius:12, border:"1px solid #141414", overflow:"hidden" }}>
                {dm.map((m,i)=>(
                  <div key={m.id} onClick={()=>onMovieClick(m)}
                    style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px",
                      borderBottom:i<dm.length-1?"1px solid #0f0f0f":"none",
                      cursor:"pointer", transition:"background 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="#141414"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <img src={getPoster(m.poster)} alt={m.title}
                      style={{ width:38, height:56, objectFit:"cover", display:"block", WebkitBackfaceVisibility:"hidden", backfaceVisibility:"hidden", borderRadius:5, flexShrink:0 }}
                      onError={e=>{e.target.src=`https://placehold.co/38x56/1a1a1a/888?text=?`;}}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontFamily:"'Anton',sans-serif", fontSize:13, color:"#fff",
                        margin:"0 0 3px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m.title}</p>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <span style={{ color:c, fontFamily:"'Space Mono',monospace", fontSize:9 }}>{m.year}</span>
                        <span style={{ color:"#333" }}>·</span>
                        <span style={{ color:"#555", fontSize:9 }}>{m.runtime}</span>
                      </div>
                    </div>
                    <ImdbBadge score={m.imdb}/>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
    </PageWrapper>
  );
};