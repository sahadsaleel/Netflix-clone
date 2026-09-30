const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

// Helper function to safely fetch from TMDB with timeout
async function fetchSafe(url, fallback = []) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (!response.ok) {
      console.warn(`TMDB request to ${url} failed with status ${response.status}`)
      return fallback
    }

    const data = await response.json()
    return data.results || fallback
  } catch (error) {
    console.warn(`TMDB fetch error for ${url}:`, error.message)
    return fallback
  }
}

// 1. Trending Movies
export async function getTrendingMovies() {
  const url = `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
  const movies = await fetchSafe(url, backupMovies)
  return movies.map(m => ({ ...m, media_type: "movie" }))
}

// 2. Trending TV Series
export async function getTrendingTV() {
  const url = `${BASE_URL}/trending/tv/week?api_key=${API_KEY}`
  const shows = await fetchSafe(url, backupTV)
  return shows.map(s => ({ ...s, media_type: "tv" }))
}

// 3. Top Rated Movies
export async function getTopRatedMovies() {
  const url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=1`
  const movies = await fetchSafe(url, backupMovies)
  return movies.map(m => ({ ...m, media_type: "movie" }))
}

// 4. Popular TV Series
export async function getPopularTV() {
  const url = `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=1`
  const shows = await fetchSafe(url, backupTV)
  return shows.map(s => ({ ...s, media_type: "tv" }))
}

// 5. Popular Movies
export async function getPopularMovies() {
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`
  const movies = await fetchSafe(url, backupMovies)
  return movies.map(m => ({ ...m, media_type: "movie" }))
}

// 6. Action Movies
export async function getActionMovies() {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28&page=1`
  const movies = await fetchSafe(url, backupMovies)
  return movies.map(m => ({ ...m, media_type: "movie" }))
}

// 7. Comedy Movies
export async function getComedyMovies() {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35&page=1`
  const movies = await fetchSafe(url, backupMovies)
  return movies.map(m => ({ ...m, media_type: "movie" }))
}

// 8. Sci-Fi & Fantasy
export async function getSciFiMovies() {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=878&page=1`
  const movies = await fetchSafe(url, backupMovies)
  return movies.map(m => ({ ...m, media_type: "movie" }))
}

// 9. Top Rated TV Shows
export async function getTopRatedTV() {
  const url = `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&page=1`
  const shows = await fetchSafe(url, backupTV)
  return shows.map(s => ({ ...s, media_type: "tv" }))
}

// 10. Search across Movies & TV Shows
export async function searchMedia(query) {
  if (!query || !query.trim()) return []
  const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query.trim())}&page=1`
  return await fetchSafe(url, [])
}

// 11. Fetch exact matching Official Trailer for movie or TV
export async function getMediaTrailer(mediaType = "movie", id) {
  if (!id) return null

  // Known verified official trailers for popular/backup titles
  const verifiedTrailers = {
    939243: { key: "LH1J1EbqCaI", name: "Official Trailer 2" }, // Sonic 3
    533535: { key: "73_1biulkYk", name: "Official Trailer" }, // Deadpool & Wolverine
    1022789: { key: "LEjhY15eCx0", name: "Official Trailer" }, // Inside Out 2
    693134: { key: "U2Qp5pL3ovA", name: "Official Trailer 3" }, // Dune: Part Two
    66732: { key: "b9EkMc79ZSU", name: "Official Final Trailer" }, // Stranger Things
    93405: { key: "oqxAJKy0ii4", name: "Official Trailer" }, // Squid Game
    94605: { key: "fXmAurh012s", name: "Official Trailer" }, // Arcane
    119051: { key: "Qa5kFRxBkNw", name: "Official Trailer" } // Wednesday
  }

  const primaryType = mediaType === "tv" ? "tv" : "movie"
  const secondaryType = primaryType === "tv" ? "movie" : "tv"

  async function fetchVideosFromTMDB(type) {
    try {
      const res = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`)
      if (!res.ok) return []
      const data = await res.json()
      return (data.results || []).filter((v) => v.site === "YouTube" && v.key)
    } catch {
      return []
    }
  }

  try {
    let videos = await fetchVideosFromTMDB(primaryType)

    // If no videos found for primary type, check secondary type
    if (videos.length === 0) {
      videos = await fetchVideosFromTMDB(secondaryType)
    }

    if (videos.length > 0) {
      // 1. Highest priority: Official Trailer with "Official Trailer" in title
      const officialMainTrailer = videos.find(
        (v) => v.type === "Trailer" && v.official && /official trailer/i.test(v.name)
      )
      if (officialMainTrailer) return officialMainTrailer.key

      // 2. Any official trailer
      const anyOfficialTrailer = videos.find(
        (v) => v.type === "Trailer" && v.official
      )
      if (anyOfficialTrailer) return anyOfficialTrailer.key

      // 3. Any trailer with "trailer" in the title
      const trailerWithName = videos.find(
        (v) => v.type === "Trailer" && /trailer/i.test(v.name)
      )
      if (trailerWithName) return trailerWithName.key

      // 4. Any video marked as Trailer
      const anyTrailer = videos.find((v) => v.type === "Trailer")
      if (anyTrailer) return anyTrailer.key

      // 5. Official teaser
      const officialTeaser = videos.find(
        (v) => v.type === "Teaser" && v.official
      )
      if (officialTeaser) return officialTeaser.key

      // 6. Any teaser
      const anyTeaser = videos.find((v) => v.type === "Teaser")
      if (anyTeaser) return anyTeaser.key

      // 7. Fallback to first available video
      return videos[0].key
    }

    // Check verified list if TMDB video list was empty
    if (verifiedTrailers[id]) {
      return verifiedTrailers[id].key
    }

    return null
  } catch (error) {
    console.warn("Trailer fetch error:", error)
    return verifiedTrailers[id]?.key || null
  }
}


// High quality backup data if network fails or offline
const backupMovies = [
  {
    id: 939243,
    title: "Sonic the Hedgehog 3",
    name: "Sonic the Hedgehog 3",
    overview: "Sonic, Knuckles, and Tails reunite against a powerful new adversary, Shadow, a mysterious villain with powers unlike anything they have faced before.",
    backdrop_path: "/zOpeNs0D43Qr02zCg5eOeo49tZz.jpg",
    poster_path: "/d8Ryb8AunYAuycPtY2Pk5Rwhxba.jpg",
    vote_average: 7.8,
    release_date: "2024-12-20",
    media_type: "movie"
  },
  {
    id: 533535,
    title: "Deadpool & Wolverine",
    name: "Deadpool & Wolverine",
    overview: "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again.",
    backdrop_path: "/yDHYTjA3R0jFYba16jBB1jv82E9.jpg",
    poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    vote_average: 7.7,
    release_date: "2024-07-26",
    media_type: "movie"
  },
  {
    id: 1022789,
    title: "Inside Out 2",
    name: "Inside Out 2",
    overview: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust aren't sure how to feel when Anxiety shows up.",
    backdrop_path: "/stKGOmvZtuY1t4m5mUj1dD9A1x7.jpg",
    poster_path: "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    vote_average: 7.6,
    release_date: "2024-06-14",
    media_type: "movie"
  },
  {
    id: 693134,
    title: "Dune: Part Two",
    name: "Dune: Part Two",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s520QIe.jpg",
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    vote_average: 8.2,
    release_date: "2024-03-01",
    media_type: "movie"
  }
]

const backupTV = [
  {
    id: 66732,
    name: "Stranger Things",
    title: "Stranger Things",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    vote_average: 8.6,
    first_air_date: "2016-07-15",
    media_type: "tv"
  },
  {
    id: 94605,
    name: "Arcane",
    title: "Arcane",
    overview: "Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and incompatible convictions.",
    backdrop_path: "/abPQZG5O8qR477l1z6Yd76VpQ1Z.jpg",
    poster_path: "/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",
    vote_average: 8.7,
    first_air_date: "2021-11-06",
    media_type: "tv"
  },
  {
    id: 93405,
    name: "Squid Game",
    title: "Squid Game",
    overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
    backdrop_path: "/2meO1n3f2cIqfB0bC0y6jM6b0L.jpg",
    poster_path: "/dDlG0T27X4lVbvyg95V8f4t9u5s.jpg",
    vote_average: 8.0,
    first_air_date: "2021-09-17",
    media_type: "tv"
  },
  {
    id: 119051,
    name: "Wednesday",
    title: "Wednesday",
    overview: "A sleuthing, supernaturally infused mystery charting Wednesday Addams' years as a student at Nevermore Academy.",
    backdrop_path: "/iHSwvFe7axIMpqISymiZGQZ02x8.jpg",
    poster_path: "/9PFonQ9211zTvy8h1N47qDkP9Y.jpg",
    vote_average: 8.4,
    first_air_date: "2022-11-23",
    media_type: "tv"
  }
]