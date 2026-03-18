import React, { useEffect } from 'react';
import { getPoster } from '../../utils/helpers';
import { ImdbBadge } from '../ui/ImdbBadge';
import { StarRating } from '../ui/StarRating';

export const MovieModal = ({ movie, onClose, isMobile, ottPlatforms = {} }) => {
  const resolveOtt = (val) => {
    if (!val) return null;
    if (val.startsWith('http') || val.startsWith('data:')) return val;
    return ottPlatforms[val] || ottPlatforms[val.toLowerCase()] || ottPlatforms[val.toUpperCase()] || null;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!movie) return null;

  if (isMobile) {
    return (
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end", backdropFilter: "blur(8px)" }}>
        <div onClick={(e) => e.stopPropagation()} style={{ background: "#0f0f0f", border: "1px solid #222", borderRadius: "18px 18px 0 0", width: "100%", maxHeight: "90vh", overflowY: "auto", animation: "slideUp 0.3s ease" }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 0" }}>
            <div style={{ width: 36, height: 4, background: "#333", borderRadius: 2 }} />
          </div>
          <div style={{ display: "flex", gap: 14, padding: "14px 16px 0" }}>
            <img src={getPoster(movie.poster)} alt={movie.title} style={{ width: 100, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} onError={(e) => { e.target.src = `https://placehold.co/100x150/1a1a1a/F5C518?text=?`; }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ margin: "0 0 5px", color: "#fff", fontFamily: "'Anton',sans-serif", fontSize: 20, lineHeight: 1.1 }}>{movie.title}</h2>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 7, flexWrap: "wrap" }}>
                <span style={{ color: "#F5C518", fontFamily: "'Space Mono',monospace", fontSize: 10 }}>{movie.year}</span>
                <span style={{ color: "#333" }}>•</span>
                <span style={{ color: "#777", fontSize: 10 }}>{movie.runtime}</span>
                <span style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 3, padding: "1px 5px", fontSize: 8, color: "#999" }}>{movie.rating}</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                {(movie.genre || []).map((g) => (
                  <span key={g} style={{ background: "#1a1a1a", border: "1px solid #F5C51840", color: "#F5C518", borderRadius: 20, padding: "2px 8px", fontSize: 8, fontFamily: "'Space Mono',monospace" }}>{g}</span>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ImdbBadge score={movie.imdb} small />
                <StarRating score={movie.imdb} small />
              </div>
            </div>
          </div>
          <div style={{ padding: "16px 16px 32px" }}>
            <p style={{ color: "#555", fontSize: 8, fontFamily: "'Space Mono',monospace", letterSpacing: 1, margin: "0 0 8px" }}>REVIEW</p>
            <p style={{ color: "#ccc", fontFamily: "'Lora',serif", fontSize: 13, lineHeight: 1.75, fontStyle: "italic", margin: "0 0 10px" }}>"{movie.review}"</p>
            <p style={{ color: "#444", fontSize: 10, fontFamily: "'Space Mono',monospace", margin: "0 0 16px" }}>— {movie.reviewer}</p>
            {(movie.ott || []).length > 0 && (
              <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 14, marginBottom: 16 }}>
                <p style={{ color: "#444", fontSize: 8, fontFamily: "'Space Mono',monospace", letterSpacing: 1, margin: "0 0 10px" }}>AVAILABLE ON</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {(movie.ott || []).map((val, i) => {
                    const imgUrl = resolveOtt(val);
                    const label = val.startsWith('http') || val.startsWith('data:') ? '' : val;
                    if (!imgUrl) return (
                      <div key={i} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "5px 10px", fontSize: 9, fontFamily: "'Space Mono',monospace", color: "#888" }}>{label || 'OTT'}</div>
                    );
                    return (
                      <div key={i} style={{ width: 44, height: 44, borderRadius: 10, border: "1px solid #2a2a2a", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 5, boxShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                        <img src={imgUrl} alt={label} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.style.opacity = '0'; }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 12 }}>
              <p style={{ color: "#444", fontSize: 8, fontFamily: "'Space Mono',monospace", letterSpacing: 1, margin: "0 0 3px" }}>DIRECTOR</p>
              <p style={{ color: "#bbb", fontSize: 13, fontFamily: "'Lora',serif", margin: 0 }}>{movie.director}</p>
            </div>
            <button onClick={onClose} style={{ marginTop: 20, width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#888", padding: "12px 0", borderRadius: 10, cursor: "pointer", fontFamily: "'Space Mono',monospace", fontSize: 11 }}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(10px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#0f0f0f", border: "1px solid #252525", borderRadius: 18, maxWidth: 680, width: "100%", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.8)", animation: "modalIn 0.25s ease" }}>
        <div style={{ display: "flex" }}>
          <div style={{ width: 220, flexShrink: 0 }}>
            <img src={getPoster(movie.poster, "w1280")} alt={movie.title} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 340 }} onError={(e) => { e.target.src = `https://placehold.co/220x340/1a1a1a/F5C518?text=${encodeURIComponent(movie.title)}`; }} />
          </div>
          <div style={{ flex: 1, padding: "24px 24px 20px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <h2 style={{ margin: 0, color: "#fff", fontFamily: "'Anton',sans-serif", fontSize: 26, lineHeight: 1.1 }}>{movie.title}</h2>
              <button onClick={onClose} style={{ background: "none", border: "1px solid #2a2a2a", color: "#666", cursor: "pointer", borderRadius: "50%", width: 30, height: 30, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 8 }}>
              <span style={{ color: "#F5C518", fontFamily: "'Space Mono',monospace", fontSize: 11 }}>{movie.year}</span>
              <span style={{ color: "#333" }}>•</span>
              <span style={{ color: "#777", fontSize: 10 }}>{movie.runtime}</span>
              <span style={{ color: "#333" }}>•</span>
              <span style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 3, padding: "1px 6px", fontSize: 9, color: "#999" }}>{movie.rating}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
              {(movie.genre || []).map((g) => (
                <span key={g} style={{ background: "#1a1a1a", border: "1px solid #F5C51840", color: "#F5C518", borderRadius: 20, padding: "2px 9px", fontSize: 9, fontFamily: "'Space Mono',monospace" }}>{g}</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <ImdbBadge score={movie.imdb} />
              <StarRating score={movie.imdb} />
              <span style={{ color: "#F5C518", fontFamily: "'Anton',sans-serif", fontSize: 20 }}>{movie.imdb}</span>
              <span style={{ color: "#333", fontSize: 11 }}>/10</span>
            </div>
            <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 14, flex: 1 }}>
              <p style={{ color: "#555", fontSize: 9, fontFamily: "'Space Mono',monospace", letterSpacing: 1, marginBottom: 7 }}>REVIEW</p>
              <p style={{ color: "#ccc", fontFamily: "'Lora',serif", fontSize: 12.5, lineHeight: 1.75, fontStyle: "italic", margin: "0 0 10px" }}>"{movie.review}"</p>
              <p style={{ color: "#444", fontSize: 10, fontFamily: "'Space Mono',monospace" }}>— {movie.reviewer}</p>
            </div>
            <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 12, marginTop: "auto" }}>
              {(movie.ott || []).length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <p style={{ color: "#444", fontSize: 8, fontFamily: "'Space Mono',monospace", letterSpacing: 1, margin: "0 0 10px" }}>AVAILABLE ON</p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {(movie.ott || []).map((val, i) => {
                      const imgUrl = resolveOtt(val);
                      const label = val.startsWith('http') || val.startsWith('data:') ? '' : val;
                      if (!imgUrl) return (
                        <div key={i} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "6px 12px", fontSize: 10, fontFamily: "'Space Mono',monospace", color: "#888" }}>{label || 'OTT'}</div>
                      );
                      return (
                        <div key={i} style={{ width: 48, height: 48, borderRadius: 10, border: "1px solid #2a2a2a", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 6, boxShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                          <img src={imgUrl} alt={label} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.style.opacity = '0'; }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <p style={{ color: "#444", fontSize: 9, fontFamily: "'Space Mono',monospace", letterSpacing: 1, margin: "0 0 3px" }}>DIRECTOR</p>
              <p style={{ color: "#bbb", fontSize: 13, fontFamily: "'Lora',serif", margin: 0 }}>{movie.director}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
