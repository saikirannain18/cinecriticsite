import React, { useState } from 'react';
import { getFirebase } from '../../services/firebase';
import { C, display, input, btn, card } from '../../utils/adminStyles';

export function AdminLogin({ onLogin }) {
  const [email, setEmail]   = useState("");
  const [pass,  setPass]    = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !pass) { setError("Enter email and password"); return; }
    setLoading(true); setError("");
    try {
      const fb   = await getFirebase();
      const snap = await fb.getDocs(fb.collection(fb.fs, "admins"));
      const admins = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const found  = admins.find(a =>
        a.email?.toLowerCase() === email.toLowerCase() && a.password === pass
      );
      if (found) {
        onLogin({ id: found.id, name: found.name || "Admin", email: found.email });
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("Could not connect to database. Check Firebase rules.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, padding: 20 }}>
      <div className="fade-in" style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:8 }}>
            <div style={{ width:36, height:36, background: C.yellow, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🎬</div>
            <span style={{ fontFamily: display, fontSize: 24, letterSpacing: 3 }}>CINE<span style={{ color: C.yellow }}>CRITIC</span></span>
          </div>
          <p style={{ color: C.muted, fontSize: 10, letterSpacing: 2 }}>COMMAND CENTER</p>
        </div>

        {/* Form */}
        <div style={{ ...card, padding: 32 }}>
          <p style={{ fontSize: 10, color: C.sub, letterSpacing: 2, marginBottom: 24 }}>ADMIN LOGIN</p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display:"block", color: C.muted, fontSize: 9, letterSpacing: 1, marginBottom: 6 }}>EMAIL</label>
              <input style={input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" autoFocus />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display:"block", color: C.muted, fontSize: 9, letterSpacing: 1, marginBottom: 6 }}>PASSWORD</label>
              <input style={input} type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" />
            </div>
            {error && <p style={{ color: C.red, fontSize: 10, marginBottom: 16, padding:"8px 12px", background:"#1a0000", borderRadius:6, border:`1px solid #440000` }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ ...btn(), width:"100%", padding:"12px 0", fontSize:12 }}>
              {loading ? <span className="spin">⟳</span> : "ACCESS DASHBOARD →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign:"center", color:"#222", fontSize:9, marginTop:20, letterSpacing:1 }}>
          CINÉCRITIC ADMIN v2.0
        </p>
      </div>
    </div>
  );
}
