import React, { useState } from 'react';
import { getPoster } from '../../utils/helpers';
import { ImdbBadge } from './ImdbBadge';
import { StarRating } from './StarRating';

export const HeroBanner = ({ movie, featured, heroIndex, setHeroIndex, onClick, isMobile }) => {
  const [hov, setHov] = useState(false);
  if (!movie) return null;

  return (
    <div
      onClick={() => onClick(movie)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        borderRadius: isMobile ? 12 : 16,
        cursor: "pointer",
        marginBottom: isMobile ? 16 : 24,
        height: isMobile ? 200 : 340,
        background: "#0a0a0a",
        overflow: "hidden",
        boxShadow: hov
          ? "0 24px 48px rgba(245,197,24,0.18)"
          : "0 8px 32px rgba(0,0,0,0.7)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20px",
          left: "-20px",
          right: "-20px",
          bottom: "-20px",
          zIndex: 0,
        }}
      >
        <img
          src={getPoster(movie.poster)}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(28px) brightness(0.22) saturate(1.5)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: isMobile
            ? "linear-gradient(to right, rgba(0,0,0,0.92) 50%, rgba(0,0,0,0.2) 100%)"
            : "linear-gradient(to right, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.0) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "16px" : "28px 36px",
          gap: isMobile ? 10 : 28,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: isMobile ? 6 : 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                background: "#F5C518",
                color: "#000",
                fontFamily: "'Anton',sans-serif",
                fontSize: isMobile ? 7 : 9,
                letterSpacing: 2,
                padding: isMobile ? "2px 6px" : "3px 9px",
                borderRadius: 3,
              }}
            >
              FEATURED
            </span>
            <ImdbBadge score={movie.imdb} small={isMobile} />
          </div>
          <h2
            style={{
              margin: "0 0 6px",
              color: "#fff",
              fontSize: isMobile ? 18 : 32,
              fontFamily: "'Anton',sans-serif",
              letterSpacing: 1,
              lineHeight: 1.05,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {movie.title}
          </h2>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: isMobile ? 5 : 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                color: "#F5C518",
                fontFamily: "'Space Mono',monospace",
                fontSize: isMobile ? 9 : 11,
              }}
            >
              {movie.year}
            </span>
            <span style={{ color: "#444" }}>•</span>
            <span
              style={{
                color: "#bbb",
                fontSize: isMobile ? 9 : 10,
                fontFamily: "'Space Mono',monospace",
              }}
            >
              {isMobile ? movie.director.split(" ").pop() : "Dir. " + movie.director}
            </span>
            {!isMobile && (
              <>
                <span style={{ color: "#444" }}>•</span>
                <span style={{ color: "#999", fontSize: 10, fontFamily: "'Space Mono',monospace" }}>
                  {movie.runtime}
                </span>
              </>
            )}
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: isMobile ? 5 : 12 }}>
            {(movie.genre || []).slice(0, isMobile ? 2 : 4).map((g) => (
              <span
                key={g}
                style={{
                  background: "rgba(245,197,24,0.12)",
                  border: "1px solid rgba(245,197,24,0.3)",
                  color: "#F5C518",
                  borderRadius: 20,
                  padding: "2px 8px",
                  fontSize: isMobile ? 7 : 9,
                  fontFamily: "'Space Mono',monospace",
                }}
              >
                {g}
              </span>
            ))}
          </div>
          {!isMobile && (
            <p
              style={{
                color: "#bbb",
                fontFamily: "'Lora',serif",
                fontSize: 12.5,
                lineHeight: 1.7,
                maxWidth: 460,
                margin: "0 0 12px",
                fontStyle: "italic",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              &ldquo;{movie.review}&rdquo;
            </p>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <StarRating score={movie.imdb} small={isMobile} />
            <span
              style={{
                color: "#555",
                fontFamily: "'Space Mono',monospace",
                fontSize: isMobile ? 8 : 10,
              }}
            >
              — {movie.reviewer}
            </span>
          </div>
        </div>

        <div
          style={{
            flexShrink: 0,
            width: isMobile ? 86 : 175,
            height: isMobile ? 128 : 263,
            borderRadius: isMobile ? 8 : 14,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: hov
              ? "0 20px 48px rgba(0,0,0,0.95), 0 0 0 2px #F5C518"
              : "0 12px 36px rgba(0,0,0,0.85)",
            transition: "box-shadow 0.3s ease",
          }}
        >
          <img
            src={getPoster(movie.poster)}
            alt={movie.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
            }}
            onError={(e) => {
              e.target.src =
                "https://placehold.co/175x263/1a1a1a/F5C518?text=" +
                encodeURIComponent(movie.title);
            }}
          />
        </div>
      </div>

      {featured && featured.length > 1 && (
        <div style={{
          position: "absolute",
          bottom: isMobile ? 8 : 16,
          left: 0, right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 6,
          zIndex: 10
        }}>
          {featured.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                if (setHeroIndex) setHeroIndex(idx);
              }}
              style={{
                width: heroIndex === idx ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: heroIndex === idx ? "#F5C518" : "rgba(255,255,255,0.3)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
