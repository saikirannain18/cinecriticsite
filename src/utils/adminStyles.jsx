/* eslint-disable react-refresh/only-export-components */
import React from 'react';

// ── ADMIN STYLES ────────────────────────────────────────────────────────────
export const C = {
  bg:      "#080808",
  surface: "#0f0f0f",
  border:  "#1a1a1a",
  border2: "#252525",
  yellow:  "#F5C518",
  red:     "#ff4444",
  green:   "#22c55e",
  blue:    "#3b82f6",
  orange:  "#f97316",
  text:    "#ffffff",
  muted:   "#555555",
  sub:     "#888888",
};

export const mono   = "'Space Mono', monospace";
export const serif  = "'Lora', serif";
export const display = "'Anton', sans-serif";

export const btn = (color = C.yellow, textColor = "#000") => ({
  background: color, color: textColor, border: "none",
  padding: "8px 16px", borderRadius: 8, cursor: "pointer",
  fontFamily: mono, fontSize: 11, letterSpacing: 1, fontWeight: 700,
});

export const input = {
  background: "#111", border: `1px solid ${C.border2}`, color: C.text,
  padding: "9px 12px", borderRadius: 8, fontFamily: mono, fontSize: 11,
  width: "100%", outline: "none",
};

export const card = {
  background: C.surface, border: `1px solid ${C.border}`,
  borderRadius: 12, padding: 20,
};

// ── SHARED COMPONENTS ─────────────────────────────────────────────────
export function SectionHeader({ title, sub, noMargin }) {
  return (
    <div style={{ marginBottom: noMargin ? 0 : 20 }}>
      <h2 style={{ fontFamily:display, fontSize:22, letterSpacing:2, color:C.text }}>{title.toUpperCase()}</h2>
      {sub && <p style={{ color:C.muted, fontSize:10, marginTop:3 }}>{sub}</p>}
    </div>
  );
}
