const GROQ_API_KEY = import.meta.env.VITE_MODAL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB;

export async function fetchTmdbPoster(title, year) {
  if (!TMDB_API_KEY) {
    console.warn("TMDb: VITE_TMDB_KEY is missing");
    return null;
  }
  try {
    const query = encodeURIComponent(title.trim());
    let url = `https://api.themoviedb.org/3/search/movie?query=${query}&year=${year}&api_key=${TMDB_API_KEY}`;
    let res = await fetch(url);
    let data = await res.json();
    if (data.results?.[0]?.poster_path) {
      return `https://image.tmdb.org/t/p/w1280${data.results[0].poster_path}`;
    }

    url = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${TMDB_API_KEY}`;
    res = await fetch(url);
    data = await res.json();
    if (data.results?.[0]?.poster_path) {
      return `https://image.tmdb.org/t/p/w1280${data.results[0].poster_path}`;
    }
    return null;
  } catch (e) {
    console.error("TMDb fetch error:", e.message);
    return null;
  }
}

export async function askGroq(movieName) {
  if (GROQ_API_KEY === "YOUR_GROQ_API_KEY" || !GROQ_API_KEY) {
    throw new Error("VITE_GROQ_KEY missing from .env");
  }

  const prompt = `You are a movie database assistant. For the movie "${movieName}", return ONLY a valid JSON object. No explanation, no markdown, no code fences. Start directly with { and end with }.

{"title":"exact movie title","year":2023,"imdb":8.5,"director":"Director Full Name","runtime":"142 min","rating":"PG-13","reviewer":"CinéCritic","review":"A compelling 2-sentence critic review.","featured":false,"poster":"","genre":["Genre1","Genre2"],"ott":[]}

Rules:
- year: integer, no quotes
- imdb: decimal number like 8.5, no quotes
- genre: 1-3 items from: Action, Adventure, Animation, Comedy, Crime, Documentary, Drama, Fantasy, History, Horror, Music, Mystery, Romance, Sci-Fi, Thriller, War, Western
- rating: one of G, PG, PG-13, R, NC-17, UA, A
- poster: leave as empty string ""
- ott: empty array []`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Groq API error ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";
  if (!text) throw new Error("Groq returned empty response");

  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("No JSON found in response: " + text.slice(0, 100));
  }

  return JSON.parse(text.slice(jsonStart, jsonEnd + 1));
}
