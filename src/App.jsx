import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getFirebase } from "./services/firebase";
import { FallbackApp } from "./components/FallbackApp";
import { MainLayout } from "./components/layout/MainLayout";
import { Home } from "./pages/Home";
import { Top250Page } from "./pages/Top250Page";
import { MostPopularPage } from "./pages/MostPopularPage";
import { NewReleasesPage } from "./pages/NewReleasesPage";
import { ReleaseCalendarPage } from "./pages/ReleaseCalendarPage";
import "./App.css";

function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setW(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return w;
}

export default function App() {
  const w = useWindowWidth();
  const isMobile = w <= 768;

  // Global State
  const [movies, setMovies] = useState([]);
  const [ottPlatforms, setOttPlatforms] = useState({});
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState("loading"); // "loading" | "live" | "demo"

  // Filter State
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [search, setSearch] = useState("");

  // UI State
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [prevIsMobile, setPrevIsMobile] = useState(isMobile);

  if (isMobile !== prevIsMobile) {
    setPrevIsMobile(isMobile);
    setSidebarOpen(!isMobile);
  }

  useEffect(() => {
    let unsubs = [];
    async function init() {
      const fb = await getFirebase();
      if (!fb) {
        setDataSource("demo");
        setLoading(false);
        return;
      }

      setDataSource("live");

      const uMovies = fb.onSnapshot(fb.collection(fb.fs, "movies"), (snap) => {
        const mv = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        mv.sort((a, b) => b.year - a.year);
        setMovies(mv);
        setLoading(false);
      });
      unsubs.push(uMovies);

      const uOtt = fb.onSnapshot(fb.collection(fb.fs, "ott_platforms"), (snap) => {
        const plat = {};
        snap.docs.forEach((d) => {
          const dt = d.data();
          plat[dt.name] = dt.iconUrl;
          if (dt.name.toLowerCase() !== dt.name) {
            plat[dt.name.toLowerCase()] = dt.iconUrl;
          }
        });
        setOttPlatforms(plat);
      });
      unsubs.push(uOtt);
    }
    init();
    return () => unsubs.forEach((u) => u());
  }, []);



  const featured = movies.filter((m) => m.featured);
  // Auto-rotate hero if not interacting
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (dataSource === "demo") {
    return <FallbackApp />;
  }

  const genres = ["All", ...Array.from(new Set(movies.flatMap(m => m.genre || [])))].sort();
  const years = ["All", ...Array.from(new Set(movies.map(m => String(m.year))))].sort((a, b) => b - a);

  const sharedProps = {
    movies, isMobile, onMovieClick: setSelectedMovie,
    selectedGenre, setSelectedGenre, selectedYear, setSelectedYear,
    selectedRating, setSelectedRating
  };

  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", background: "#080808", color: "#fff", fontFamily: "'Space Mono',monospace" }}>
        <Routes>
          <Route path="/" element={
            <MainLayout
              {...sharedProps}
              search={search} setSearch={setSearch}
              dataSource={dataSource}
              sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
              genres={genres} years={years}
              selectedMovie={selectedMovie} setSelectedMovie={setSelectedMovie}
              ottPlatforms={ottPlatforms}
            />
          }>
            <Route index element={
              <Home
                {...sharedProps}
                loading={loading} featured={featured} heroIndex={heroIndex} setHeroIndex={setHeroIndex}
                search={search}
              />
            } />
            <Route path="top-rated" element={<Top250Page title="TOP RATED" {...sharedProps} />} />
            <Route path="new-releases" element={<NewReleasesPage {...sharedProps} />} />
            <Route path="top250" element={<Top250Page {...sharedProps} />} />
            <Route path="most-popular" element={<MostPopularPage {...sharedProps} />} />
            <Route path="release-calendar" element={<ReleaseCalendarPage {...sharedProps} />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}