import React, { useState } from 'react';
import { getPoster } from '../../utils/helpers';
import { ImdbBadge } from './ImdbBadge';
import { StarRating } from './StarRating';

export const MovieCard = ({ movie, onClick, isMobile }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      onClick={() => onClick(movie)}
      style={{
        borderRadius: 10,
        overflow: "hidden",
        background: "#141414",
        cursor: "pointer",
        border: hovered ? "1px solid #F5C518" : "1px solid #1e1e1e",
        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
        boxShadow: hovered
          ? "0 16px 36px rgba(245,197,24,0.18)"
          : "0 2px 10px rgba(0,0,0,0.4)",
        transform: hovered ? "translateY(-4px)" : "none",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "2/3", overflow: "hidden" }}>
        <img
          src={getPoster(movie.poster)}
          alt={movie.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.35s ease",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
          }}
          onError={(e) => {
            e.target.src = `https://placehold.co/300x450/1a1a1a/F5C518?text=${encodeURIComponent(
              movie.title
            )}`;
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)",
          }}
        />
        <div style={{ position: "absolute", top: 6, right: 6 }}>
          <ImdbBadge score={movie.imdb} small />
        </div>
        {movie.featured && (
          <div
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              background: "#F5C518",
              borderRadius: 3,
              padding: "1px 5px",
            }}
          >
            <span
              style={{
                fontFamily: "'Anton',sans-serif",
                fontSize: 7,
                color: "#000",
                letterSpacing: 1,
              }}
            >
              FEATURED
            </span>
          </div>
        )}
      </div>
      <div style={{ padding: "9px 11px 10px" }}>
        <h3
          style={{
            margin: "0 0 3px",
            color: "#fff",
            fontSize: isMobile ? 12 : 13,
            fontFamily: "'Anton',sans-serif",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {movie.title}
        </h3>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ color: "#F5C518", fontSize: 9, fontFamily: "'Space Mono',monospace" }}>
            {movie.year}
          </span>
          <span style={{ color: "#555", fontSize: 8, fontFamily: "'Space Mono',monospace" }}>
            {movie.runtime}
          </span>
        </div>
        <StarRating score={movie.imdb} small />
        <div style={{ marginTop: 5, display: "flex", flexWrap: "wrap", gap: 3 }}>
          {(movie.genre || []).slice(0, 2).map((g) => (
            <span
              key={g}
              style={{
                background: "#1e1e1e",
                border: "1px solid #2a2a2a",
                borderRadius: 20,
                padding: "1px 6px",
                fontSize: 7,
                color: "#888",
                fontFamily: "'Space Mono',monospace",
              }}
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
