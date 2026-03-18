import React, { useState } from 'react';
import { getFirebase } from '../../../services/firebase';
import { fetchTmdbPoster, askGroq } from '../../../services/api';
import { C, card, btn, input, SectionHeader } from '../../../utils/adminStyles';

const TMDB_API_KEY = import.meta.env.VITE_TMDB;

export function MoviesTab({ movies, ottPlatforms, isMobile }) {
  const [view,     setView]     = useState("list");
  const [editMovie,setEditMovie]= useState(null);
  const [search,   setSearch]   = useState("");
  const [deleting, setDeleting] = useState(null);
  const [msg,      setMsg]      = useState("");

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

  if (view==="add")  return <MovieForm mode="add"  ottPlatforms={ottPlatforms} isMobile={isMobile} onBack={()=>setView("list")} />;
  if (view==="edit") return <MovieForm mode="edit" movie={editMovie} ottPlatforms={ottPlatforms} isMobile={isMobile} onBack={()=>setView("list")} />;

  return (
    <div>
      {/* Header row */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        {!isMobile && <SectionHeader title="Movies" sub={`${movies.length} total`} noMargin />}
        <div style={{ marginLeft: isMobile?"0":"auto", display:"flex", gap:8, flex: isMobile?1:0, flexWrap:"wrap" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search..." style={{ ...input, flex:1, minWidth:0, padding:"7px 10px", fontSize:11 }} />
          <button onClick={()=>setView("add")} style={{ ...btn(), whiteSpace:"nowrap", padding:"7px 14px" }}>+ ADD</button>
        </div>
      </div>

      {msg && <div style={{ background:"#0a1a0a", border:`1px solid #1a4a1a`, borderRadius:8, padding:"10px 14px", marginBottom:12, fontSize:11, color:C.green }}>{msg}</div>}

      {isMobile ? (
        // Mobile: card list
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map(m => (
            <div key={m.id} style={{ ...card, display:"flex", gap:10, padding:12 }}>
              {m.poster
                ? <img src={m.poster} style={{ width:40, height:60, objectFit:"cover", borderRadius:4, flexShrink:0 }} onError={e=>e.target.style.display="none"} />
                : <div style={{ width:40, height:60, background:"#1a1a1a", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>?</div>
              }
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:12, color:C.text, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{m.title}</p>
                <p style={{ fontSize:10, color:C.sub, marginTop:1 }}>{m.year} · {m.director}</p>
                <div style={{ display:"flex", gap:6, marginTop:4, alignItems:"center", flexWrap:"wrap" }}>
                  <span style={{ fontSize:11, color:C.yellow }}>★ {m.imdb}</span>
                  {m.featured && <span style={{ fontSize:8, background:"#F5C51820", color:C.yellow, padding:"1px 5px", borderRadius:3 }}>FEATURED</span>}
                  {(m.ott||[]).slice(0,2).map((o,i)=><span key={i} style={{ fontSize:8, background:"#1a1a1a", color:C.muted, padding:"1px 5px", borderRadius:3 }}>{o}</span>)}
                </div>
                <div style={{ display:"flex", gap:6, marginTop:8 }}>
                  <button onClick={()=>{setEditMovie(m);setView("edit");}}
                    style={{ ...btn(C.blue,"#fff"), padding:"5px 12px", fontSize:9, flex:1 }}>EDIT</button>
                  <button onClick={()=>handleDelete(m)} disabled={deleting===m.id}
                    style={{ ...btn(C.red,"#fff"), padding:"5px 12px", fontSize:9, flex:1, opacity:deleting===m.id?.5:1 }}>
                    {deleting===m.id?"...":"DELETE"}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!filtered.length && <p style={{ color:C.muted, fontSize:11, textAlign:"center", padding:20 }}>No movies found</p>}
        </div>
      ) : (
        // Desktop: table
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
                      ? <img src={m.poster} style={{ width:28, height:42, objectFit:"cover", borderRadius:3 }} onError={e=>e.target.style.display="none"} />
                      : <div style={{ width:28, height:42, background:"#1a1a1a", borderRadius:3, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10 }}>?</div>}
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
                      {(m.ott||[]).slice(0,2).map((o,i)=><span key={i} style={{ fontSize:8, background:"#1a1a1a", border:`1px solid ${C.border2}`, borderRadius:3, padding:"1px 5px", color:C.sub }}>{o}</span>)}
                      {(m.ott||[]).length>2 && <span style={{ fontSize:8, color:C.muted }}>+\t{m.ott.length-2}</span>}
                    </div>
                  </td>
                  <td style={{ padding:"8px 14px" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={()=>{setEditMovie(m);setView("edit");}} style={{ ...btn(C.blue,"#fff"), padding:"4px 10px", fontSize:9 }}>EDIT</button>
                      <button onClick={()=>handleDelete(m)} disabled={deleting===m.id} style={{ ...btn(C.red,"#fff"), padding:"4px 10px", fontSize:9, opacity:deleting===m.id?.5:1 }}>
                        {deleting===m.id?"...":"DEL"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={7} style={{ padding:32, textAlign:"center", color:C.muted, fontSize:11 }}>No movies found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── MOVIE FORM (ADD / EDIT) ───────────────────────────────────────────
function MovieForm({ mode, movie, ottPlatforms, onBack, isMobile }) {
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
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:16 }}>
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
