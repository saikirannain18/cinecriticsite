import React from 'react';

export const ImdbBadge = ({ score, small }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      background: "#F5C518",
      borderRadius: 4,
      padding: small ? "1px 5px" : "2px 7px",
    }}
  >
    <span
      style={{
        fontFamily: "'Anton',sans-serif",
        fontSize: small ? 7 : 9,
        color: "#000",
        letterSpacing: 1,
      }}
    >
      IMDb
    </span>
    <span
      style={{
        fontFamily: "'Anton',sans-serif",
        fontSize: small ? 10 : 12,
        color: "#000",
        fontWeight: 700,
      }}
    >
      {score}
    </span>
  </div>
);
