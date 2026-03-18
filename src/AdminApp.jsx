// ═══════════════════════════════════════════════════════════════════════
// AdminApp.jsx — CinéCritic Command Center Entry
// ═══════════════════════════════════════════════════════════════════════

import { useState } from "react";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { C, mono } from "./utils/adminStyles";

export default function AdminApp() {
  // Memory-only session — clears automatically when user leaves /admin
  const [session, setSession] = useState(null);

  const handleLogin  = (admin) => setSession(admin);
  const handleLogout = () => {
    setSession(null);
    window.location.href = "/"; // redirect to home on logout
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Lora:ital@0;1&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; color: ${C.text}; font-family: ${mono}; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
        input:focus, textarea:focus, select:focus { border-color: ${C.yellow} !important; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn .3s ease; }
        .pulse { animation: pulse 2s infinite; }
        .spin { animation: spin .8s linear infinite; display:inline-block; }
      `}</style>
      {session ? <AdminDashboard admin={session} onLogout={handleLogout} /> : <AdminLogin onLogin={handleLogin} />}
    </>
  );
}