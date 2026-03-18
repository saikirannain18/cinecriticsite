import React from 'react';

export const SkeletonCard = () => (
  <div style={{ borderRadius: 10, overflow: "hidden", background: "#141414", border: "1px solid #1e1e1e" }}>
    <div style={{ aspectRatio: "2/3", background: "#1e1e1e", animation: "shimmer 1.4s ease-in-out infinite" }} />
    <div style={{ padding: "10px 12px" }}>
      <div style={{ height: 12, background: "#1e1e1e", borderRadius: 4, marginBottom: 7, animation: "shimmer 1.4s ease-in-out infinite" }} />
      <div style={{ height: 9, background: "#1a1a1a", borderRadius: 4, width: "55%", animation: "shimmer 1.4s ease-in-out infinite" }} />
    </div>
  </div>
);
