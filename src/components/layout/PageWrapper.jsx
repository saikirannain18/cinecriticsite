import React from 'react';

export const PageWrapper = ({ title, subtitle, icon, accentColor, children }) => (
  <div style={{ animation: "fadeIn 0.3s ease" }}>
    <div style={{ paddingBottom: 18, marginBottom: 20, borderBottom: "1px solid #141414" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 5 }}>
        <span style={{ fontSize: 26 }}>{icon}</span>
        <h1 style={{ fontFamily: "'Anton',sans-serif", fontSize: 26, letterSpacing: 2, color: accentColor, margin: 0 }}>
          {title}
        </h1>
      </div>
      <p style={{ color: "#444", fontSize: 10, fontFamily: "'Space Mono',monospace", margin: 0, paddingLeft: 38 }}>
        {subtitle}
      </p>
    </div>
    {children}
  </div>
);
