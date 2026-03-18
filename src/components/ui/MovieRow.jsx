import React, { useState } from 'react';
import { getPoster } from '../../utils/helpers';
import { ImdbBadge } from './ImdbBadge';
import { StarRating } from './StarRating';

export const MovieRow = ({ movie, rank, onClick, accentColor = "#F5C518" }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => onClick(movie)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 14px",
        borderRadius: 8,
        cursor: "pointer",
        transition: "background 0.2s",
        background: hov ? "#141414" : "transparent",
        borderBottom: "1px solid #0f0f0f",
      }}
    >
      <div style={{ width: 36, flexShrink: 0, textAlign: "center" }}>
        <span
          style={{
            fontFamily: "'Anton',sans-serif",
            fontSize: rank <= 10 ? 22 : rank <= 50 ? 18 : 14,
            color: rank === 1 ? "#F5C518" : rank <= 3 ? "#aaa" : "#2a2a2a",
          }}
        >
          {rank}
        </span>
      </div>
      <img
        src={getPoster(movie.poster)}
        alt={movie.title}
        style={{
          width: 44,
          height: 66,
          objectFit: "cover",
          display: "block",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
          borderRadius: 6,
          flexShrink: 0,
        }}
        onError={(e) => {
          e.target.src = `https://placehold.co/44x66/1a1a1a/F5C518?text=?`;
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "'Anton',sans-serif",
            fontSize: 14,
            color: "#fff",
            margin: "0 0 3px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {movie.title}
        </p>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
          <span style={{ color: accentColor, fontFamily: "'Space Mono',monospace", fontSize: 9 }}>
            {movie.year}
          </span>
          <span style={{ color: "#333" }}>·</span>
          <span style={{ color: "#555", fontSize: 9 }}>Dir. {movie.director}</span>
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {(movie.genre || []).slice(0, 2).map((g) => (
            <span
              key={g}
              style={{
                background: "#1a1a1a",
                border: "1px solid #222",
                borderRadius: 20,
                padding: "1px 7px",
                fontSize: 8,
                color: "#666",
                fontFamily: "'Space Mono',monospace",
              }}
            >
              {g}
            </span>
          ))}
        </div>
      </div>
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
        <ImdbBadge score={movie.imdb} />
        <StarRating score={movie.imdb} />
      </div>
    </div>
  );
};
