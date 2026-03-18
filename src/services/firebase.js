export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDi9KTtfyOHY8McVA1ObzloNOekGY_tgfI",
  authDomain: "cinecriticdb.firebaseapp.com",
  projectId: "cinecriticdb",
  storageBucket: "cinecriticdb.firebasestorage.app",
  messagingSenderId: "855382839651",
  appId: "1:855382839651:web:e9fa724bd796e7af258356"
};

function isPlaceholderConfig() {
  return !FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === "YOUR_API_KEY" || FIREBASE_CONFIG.projectId === "YOUR_PROJECT_ID" || FIREBASE_CONFIG.projectId === "";
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, r) => setTimeout(() => r(new Error("timeout")), ms))
  ]);
}

let _firebase = null;

export async function getFirebase() {
  if (_firebase) return _firebase;
  if (isPlaceholderConfig()) return null;

  try {
    const [{ initializeApp, getApps }, {
      getFirestore, collection, getDocs, addDoc,
      updateDoc, deleteDoc, doc, onSnapshot, setDoc, query, orderBy, limit
    }] = await withTimeout(
      Promise.all([
        import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"),
      ]),
      8000
    );

    const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
    const fs = getFirestore(app);
    _firebase = { fs, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, setDoc, query, orderBy, limit };
    return _firebase;
  } catch (error) {
    console.error("Firebase init error:", error);
    return null;
  }
}
