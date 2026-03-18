import React, { useState } from 'react';
import { getFirebase } from '../../../services/firebase';
import { C, card, btn, input, SectionHeader } from '../../../utils/adminStyles';

export function OttTab({ ottPlatforms, setOttPlatforms, isMobile }) {
  const [name,   setName]   = useState("");
  const [image,  setImage]  = useState("");
  const [order,  setOrder]  = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting,setDeleting]=useState(null);
  const [msg,    setMsg]    = useState("");
  const [error,  setError]  = useState("");

  const handleAdd = async () => {
    if (!name || !image) { setError("Name and image URL are required"); return; }
    setSaving(true); setError("");
    try {
      const fb  = await getFirebase();
      const ref = await fb.addDoc(fb.collection(fb.fs, "ott_platforms"), {
        name, image, order: parseInt(order)||99
      });
      const newPlatform = { id:ref.id, name, image, order:parseInt(order)||99 };
      setOttPlatforms(p => [...p, newPlatform].sort((a,b)=>(a.order||99)-(b.order||99)));
      setName(""); setImage(""); setOrder("");
      setMsg("✓ Platform added!");
      setTimeout(() => setMsg(""), 3000);
    } catch (e) { setError("Failed: " + e.message); }
    setSaving(false);
  };

  const handleDelete = async (platform) => {
    if (!window.confirm(`Delete "${platform.name}"?`)) return;
    setDeleting(platform.id);
    try {
      const fb = await getFirebase();
      await fb.deleteDoc(fb.doc(fb.fs, "ott_platforms", platform.id));
      setOttPlatforms(p => p.filter(x => x.id !== platform.id));
      setMsg("✓ Platform removed");
      setTimeout(() => setMsg(""), 3000);
    } catch { setMsg("❌ Delete failed"); }
    setDeleting(null);
  };

  return (
    <div>
      <SectionHeader title="OTT Platforms" sub="Manage streaming platform logos — no code changes needed" />

      {/* Add new */}
      <div style={{ ...card, marginBottom:20 }}>
        <p style={{ color:C.muted, fontSize:9, letterSpacing:1, marginBottom:14 }}>ADD NEW PLATFORM</p>
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 4fr 1fr auto", gap:10, alignItems:"end" }}>
          <div>
            <label style={{ display:"block", color:C.muted, fontSize:9, letterSpacing:1, marginBottom:5 }}>NAME</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Netflix" style={input} />
          </div>
          <div>
            <label style={{ display:"block", color:C.muted, fontSize:9, letterSpacing:1, marginBottom:5 }}>IMAGE URL</label>
            <input value={image} onChange={e=>setImage(e.target.value)} placeholder="https://... or data:image/..." style={input} />
          </div>
          <div>
            <label style={{ display:"block", color:C.muted, fontSize:9, letterSpacing:1, marginBottom:5 }}>ORDER</label>
            <input value={order} onChange={e=>setOrder(e.target.value)} type="number" placeholder="1" style={input} />
          </div>
          <button onClick={handleAdd} disabled={saving} style={{ ...btn(), height:36, whiteSpace:"nowrap" }}>
            {saving ? <span className="spin">⟳</span> : "+ ADD"}
          </button>
        </div>
        {error && <p style={{ color:C.red, fontSize:10, marginTop:10 }}>{error}</p>}
        {msg   && <p style={{ color:C.green, fontSize:10, marginTop:10 }}>{msg}</p>}
      </div>

      {/* Current platforms */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12 }}>
        {ottPlatforms.map(p => (
          <div key={p.id} style={{ ...card, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:44, height:44, background:"#fff", borderRadius:8, padding:4, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <img src={p.image} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"contain" }} onError={e=>e.target.style.opacity="0"} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:11, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.name}</p>
              <p style={{ fontSize:9, color:C.muted }}>order: {p.order||"—"}</p>
            </div>
            <button onClick={()=>handleDelete(p)} disabled={deleting===p.id}
              style={{ ...btn(C.red,"#fff"), padding:"4px 8px", fontSize:9, flexShrink:0, opacity:deleting===p.id?.5:1 }}>
              ✗
            </button>
          </div>
        ))}
        {ottPlatforms.length === 0 && (
          <div style={{ ...card, gridColumn:"1/-1", textAlign:"center", color:C.muted, fontSize:11, padding:40 }}>
            No OTT platforms yet. Add your first one above.
          </div>
        )}
      </div>
    </div>
  );
}
