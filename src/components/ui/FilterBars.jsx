import React from 'react';

export const GenreBar = ({ genres, selected, onSelect }) => (
  <div style={{ overflowX: "auto", paddingBottom: 6, marginBottom: 16 }}>
    <div style={{ display: "flex", gap: 7, minWidth: "max-content" }}>
      {["All", ...genres].map((g) => (
        <button
          key={g}
          onClick={() => onSelect(g)}
          style={{
            background: selected === g ? "#F5C518" : "#141414",
            color: selected === g ? "#000" : "#888",
            border: selected === g ? "none" : "1px solid #222",
            borderRadius: 20,
            padding: "6px 14px",
            cursor: "pointer",
            fontFamily: "'Space Mono',monospace",
            fontSize: 10,
            fontWeight: selected === g ? 700 : 400,
            whiteSpace: "nowrap",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          {g}
        </button>
      ))}
    </div>
  </div>
);

export const YearBar = ({ years, selected, onSelect, accentColor = "#4caf50" }) => (
  <div style={{ overflowX: "auto", paddingBottom: 4, marginBottom: 16 }}>
    <div style={{ display: "flex", gap: 6, minWidth: "max-content" }}>
      {["All", ...years].map((y) => (
        <button
          key={y}
          onClick={() => onSelect(y)}
          style={{
            background: selected === y ? accentColor : "#141414",
            color: selected === y ? "#000" : "#666",
            border: selected === y ? "none" : "1px solid #222",
            borderRadius: 6,
            padding: "5px 12px",
            cursor: "pointer",
            fontFamily: "'Space Mono',monospace",
            fontSize: 10,
            fontWeight: selected === y ? 700 : 400,
            whiteSpace: "nowrap",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          {y}
        </button>
      ))}
    </div>
  </div>
);

export const ActiveFilters = ({ selectedGenre, selectedYear, selectedRating, onClear }) => {
  const active = [
    selectedGenre !== "All" && `Genre: ${selectedGenre}`,
    selectedYear !== "All" && `Year: ${selectedYear}`,
    selectedRating !== "All" && `IMDb: ${selectedRating}`,
  ].filter(Boolean);
  if (!active.length) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
      <span style={{ color: "#555", fontSize: 9, fontFamily: "'Space Mono',monospace" }}>ACTIVE:</span>
      {active.map((f) => (
        <span
          key={f}
          style={{
            background: "#F5C51815",
            border: "1px solid #F5C51840",
            color: "#F5C518",
            borderRadius: 20,
            padding: "3px 10px",
            fontSize: 9,
            fontFamily: "'Space Mono',monospace",
          }}
        >
          {f}
        </span>
      ))}
      <button
        onClick={onClear}
        style={{
          background: "none",
          border: "1px solid #2a2a2a",
          color: "#666",
          borderRadius: 20,
          padding: "3px 10px",
          fontSize: 9,
          fontFamily: "'Space Mono',monospace",
          cursor: "pointer",
        }}
      >
        Clear ✕
      </button>
    </div>
  );
};
