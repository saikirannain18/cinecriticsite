import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { MobileDrawer } from './MobileDrawer';
import { MovieModal } from '../movie/MovieModal';

export const MainLayout = ({ 
  isMobile, search, setSearch, dataSource, setSidebarOpen, sidebarOpen, 
  movies, genres, years, selectedGenre, setSelectedGenre, selectedYear, setSelectedYear, selectedRating, setSelectedRating,
  selectedMovie, setSelectedMovie, ottPlatforms
}) => {
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const navigate = useNavigate();

  const switchTab = (path) => {
    navigate(path);
  };



  const navItemStyle = ({ isActive }) => ({
    display: "flex", alignItems: "center", gap: 10, padding: isMobile ? "12px" : "8px 14px", 
    borderRadius: 8, cursor: "pointer", textDecoration: "none", marginBottom: isMobile ? 0 : 2,
    background: isActive ? "#F5C51815" : "transparent",
    borderLeft: isActive ? "2px solid #F5C518" : "2px solid transparent",
    color: isActive ? "#F5C518" : "#999", fontSize: 12, fontFamily: "'Space Mono',monospace",
    transition: "all 0.15s"
  });

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 200,
        background: "rgba(8,8,8,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid #161616",
        padding: isMobile ? "0 14px" : "0 20px", height: isMobile ? 54 : 60,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12, flexShrink: 0 }}>
          {!isMobile && (
            <button
              onClick={() => setSidebarOpen(o => !o)}
              style={{
                background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 32, height: 32, borderRadius: "50%"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#ffffff15"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              ☰
            </button>
          )}
          {isMobile && (
            <button
              onClick={() => setFilterDrawer(true)}
              style={{
                background: "none", border: "1px solid #222", color: "#ccc",
                borderRadius: 8, width: 34, height: 34, display: "flex",
                alignItems: "center", justifyContent: "center"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          )}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 10, textDecoration: "none" }} onClick={e => { e.preventDefault(); switchTab("/"); }}>
            <div style={{
              width: isMobile ? 24 : 28, height: isMobile ? 24 : 28, background: "#F5C518", borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 12 : 14, boxShadow: "0 2px 8px rgba(245,197,24,0.3)"
            }}>🎬</div>
            <span style={{ fontFamily: "'Anton',sans-serif", fontSize: isMobile ? 18 : 22, letterSpacing: 2, color: "#fff" }}>
              CINE<span style={{ color: "#F5C518" }}>CRITIC</span>
            </span>
          </a>
        </div>

        <div style={{ flex: 1, maxWidth: 500, display: "flex", alignItems: "center", justifyContent: isMobile ? "flex-end" : "center" }}>
          {isMobile ? (
            searchOpen ? (
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "#0a0a0a", display: "flex", alignItems: "center", padding: "0 10px", zIndex: 10, animation: "fadeIn 0.2s" }}>
                <input
                  autoFocus
                  value={search}
                  onChange={e => { setSearch(e.target.value); switchTab("/"); }}
                  placeholder="Search movies, directors..."
                  style={{ flex: 1, background: "none", border: "none", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'Space Mono',monospace", padding: "0 10px" }}
                />
                <button
                  onClick={() => { setSearch(""); setSearchOpen(false); }}
                  style={{ background: "none", border: "none", color: "#999", padding: 10, fontSize: 12, fontFamily: "'Space Mono',monospace" }}
                >
                  CANCEL
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                style={{ background: "#1a1a1a", border: "1px solid #222", padding: "6px", borderRadius: 8, color: "#888", display: "flex", alignItems: "center" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
            )
          ) : (
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{ position: "absolute", left: 14, top: 12, color: "#555" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); switchTab("/"); }}
                placeholder="Find a movie or director..."
                style={{
                  width: "100%", background: "#111", border: "1px solid #252525", color: "#fff",
                  padding: "10px 14px 10px 40px", borderRadius: 24, fontSize: 13, fontFamily: "'Space Mono',monospace",
                  outline: "none", transition: "all 0.2s"
                }}
                onFocus={e => { e.target.style.background = "#181818"; e.target.style.borderColor = "#F5C518"; e.target.style.boxShadow = "0 0 0 4px rgba(245,197,24,0.1)"; }}
                onBlur={e => { e.target.style.background = "#111"; e.target.style.borderColor = "#252525"; e.target.style.boxShadow = "none"; }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{ position: "absolute", right: 14, top: 12, background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 12 }}
                >✕</button>
              )}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: dataSource === "loading" ? "#f97316" : dataSource === "live" ? "#22c55e" : "#F5C518",
                boxShadow: dataSource === "live" ? "0 0 6px #22c55e" : "none",
                animation: dataSource === "loading" ? "livePulse 1s infinite" : "none"
              }} />
              <span style={{
                fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 1,
                color: dataSource === "loading" ? "#f97316" : dataSource === "live" ? "#22c55e" : "#F5C518"
              }}>
                {dataSource === "loading" ? "SYNCING..." : dataSource === "live" ? "LIVE" : "DEMO"}
              </span>
            </div>
          )}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              style={{
                background: "#F5C518", border: "none", color: "#000",
                display: "flex", alignItems: "center", gap: 6,
                padding: isMobile ? "6px" : "8px 14px", borderRadius: 8,
                cursor: "pointer", fontFamily: "'Anton',sans-serif", fontSize: 12
              }}
            >
              {!isMobile && "MORE"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
            </button>
            {moreOpen && (
              <div style={{
                position: "absolute", right: 0, top: "100%", marginTop: 8,
                background: "#141414", border: "1px solid #222", borderRadius: 8,
                padding: "8px", minWidth: 160, zIndex: 100, boxShadow: "0 10px 40px rgba(0,0,0,0.8)"
              }}>
                <a href="/admin" style={{ display: "block", color: "#ccc", textDecoration: "none", fontSize: 12, fontFamily: "'Space Mono',monospace", padding: "10px", borderRadius: 5, background: "#1a1a1a" }}>
                  ⚙️ Admin Panel →
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div style={{ display: "flex", height: isMobile ? "max-content" : "calc(100vh - 60px)" }}>
        {!isMobile && (
          <aside style={{
            width: sidebarOpen ? 220 : 0, overflow: "hidden",
            background: "#0a0a0a", borderRight: sidebarOpen ? "1px solid #161616" : "none",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", flexShrink: 0,
            display: "flex", flexDirection: "column"
          }}>
            <div style={{ width: 220, padding: "20px 14px", overflowY: "auto", flex: 1 }}>
              <p style={{ color: "#333", fontSize: 9, letterSpacing: 2, fontFamily: "'Anton',sans-serif", margin: "0 0 12px 10px" }}>NAVIGATE</p>
              <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <NavLink to="/" style={navItemStyle}><span style={{ fontSize: 16 }}>🏠</span>Home</NavLink>
                <NavLink to="/top-rated" style={navItemStyle}><span style={{ fontSize: 16 }}>⭐</span>Top Rated</NavLink>
                <NavLink to="/new-releases" style={navItemStyle}><span style={{ fontSize: 16 }}>🆕</span>New Releases</NavLink>
              </nav>

              <div style={{ height: 1, background: "#161616", margin: "16px 10px" }} />

              <p style={{ color: "#333", fontSize: 9, letterSpacing: 2, fontFamily: "'Anton',sans-serif", margin: "0 0 12px 10px" }}>EXPLORE</p>
              <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <NavLink to="/top250" style={navItemStyle}><span style={{ fontSize: 16 }}>🏆</span>Top 250 Movies</NavLink>
                <NavLink to="/most-popular" style={navItemStyle}><span style={{ fontSize: 16 }}>🌟</span>Most Popular</NavLink>
                <NavLink to="/release-calendar" style={navItemStyle}><span style={{ fontSize: 16 }}>📅</span>Release Calendar</NavLink>
              </nav>
            </div>
            {/* Footer */}
            <div style={{ padding: "16px", borderTop: "1px solid #161616" }}>
              <div style={{ background: "#F5C518", borderRadius: 8, padding: "12px", textAlign: "center", cursor: "pointer", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"} onClick={() => window.open("/admin", "_blank")}>
                <p style={{ color: "#000", fontSize: 11, fontFamily: "'Anton',sans-serif", letterSpacing: 1, margin: 0 }}>ADMIN DASHBOARD</p>
              </div>
            </div>
          </aside>
        )}

        <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: isMobile ? 14 : 28, background: "#080808", position: "relative" }}>
          <Outlet />
        </main>
      </div>

      <MobileDrawer
        open={filterDrawer} onClose={() => setFilterDrawer(false)}
        genres={genres} years={years} movies={movies}
        switchTab={switchTab}
        selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre}
        selectedYear={selectedYear} setSelectedYear={setSelectedYear}
        selectedRating={selectedRating} setSelectedRating={setSelectedRating}
        onMovieClick={setSelectedMovie}
      />

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} isMobile={isMobile} ottPlatforms={ottPlatforms} />}
    </>
  );
};
