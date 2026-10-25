import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import NetflixBillboard from "../components/NetflixBillboard"
import MovieRow from "../components/MovieRow"
import MovieCard from "../components/MovieCard"
import MovieDetailModal from "../components/MovieDetailModal"
import Hero from "../components/Hero"
import FeatureCards from "../components/FeatureCards"
import FAQ from "../components/FAQ"
import Footer from "../components/Footer"

import {
  getTrendingMovies,
  getTrendingTV,
  getPopularMovies,
  getPopularTV,
  getTopRatedMovies,
  getTopRatedTV,
  getActionMovies,
  getComedyMovies,
  getSciFiMovies,
  searchMedia
} from "../api/movieApi"

function Home() {
  const { currentUser, loading: authLoading, myList } = useAuth()

  const [activeTab, setActiveTab] = useState("home")

  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // Movie & TV Series Data States
  const [trendingMovies, setTrendingMovies] = useState([])
  const [trendingTV, setTrendingTV] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [popularTV, setPopularTV] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [topRatedTV, setTopRatedTV] = useState([])
  const [actionMovies, setActionMovies] = useState([])
  const [comedyMovies, setComedyMovies] = useState([])
  const [sciFiMovies, setSciFiMovies] = useState([])

  // Featured title for billboard
  const [featuredItem, setFeaturedItem] = useState(null)

  // Detail Modal state
  const [selectedMovie, setSelectedMovie] = useState(null)

  // Fetch movies and TV series only if user is logged in
  useEffect(() => {
    if (!currentUser) return

    let isMounted = true

    async function loadContent() {
      try {
        const [
          trendingM,
          trendingT,
          popM,
          popT,
          topM,
          topT,
          actionM,
          comedyM,
          scifiM
        ] = await Promise.all([
          getTrendingMovies(),
          getTrendingTV(),
          getPopularMovies(),
          getPopularTV(),
          getTopRatedMovies(),
          getTopRatedTV(),
          getActionMovies(),
          getComedyMovies(),
          getSciFiMovies()
        ])

        if (!isMounted) return

        setTrendingMovies(trendingM)
        setTrendingTV(trendingT)
        setPopularMovies(popM)
        setPopularTV(popT)
        setTopRatedMovies(topM)
        setTopRatedTV(topT)
        setActionMovies(actionM)
        setComedyMovies(comedyM)
        setSciFiMovies(scifiM)

        // Select a featured movie or TV show with high resolution backdrop
        const pool = [...trendingM, ...trendingT].filter(
          (item) => item && item.backdrop_path && item.overview
        )
        if (pool.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(pool.length, 6))
          setFeaturedItem(pool[randomIndex])
        }
      } catch (err) {
        console.error("Error loading catalogue content:", err)
      }
    }

    loadContent()

    return () => {
      isMounted = false
    }
  }, [currentUser])

  // Handle Search Input Debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      const timer = setTimeout(() => {
        setSearchResults([])
        setIsSearching(false)
      }, 0)
      return () => clearTimeout(timer)
    }

    const startTimer = setTimeout(() => {
      setIsSearching(true)
    }, 0)

    const timeoutId = setTimeout(async () => {
      const results = await searchMedia(searchQuery)
      setSearchResults(results.filter((r) => r.poster_path || r.backdrop_path))
      setIsSearching(false)
    }, 350)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(timeoutId)
    }
  }, [searchQuery])

  // If Auth state is still being determined, show Netflix loader
  if (authLoading) {
    return (
      <div className="netflix-page-loader">
        <div className="netflix-spinner" />
        <span className="netflix-loader-text">NETFLIX</span>
      </div>
    )
  }

  // 1. UNLOGGED IN / GUEST VIEW
  // Per requirements: The movies and series should be visible ONLY after the user has successfully logged in.
  if (!currentUser) {
    return (
      <div className="netflix-app guest-mode">
        <Navbar />
        <Hero />
        <FeatureCards />
        <FAQ />
        <Footer />
      </div>
    )
  }

  // 2. AUTHENTICATED NETFLIX BROWSE VIEW
  return (
    <div className="netflix-app authenticated-mode">
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab)
          setSearchQuery("") // Clear search when switching tabs
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Browse Content Area */}
      <main className="netflix-browse-main">
        {/* Search View when search query is typed */}
        {searchQuery.trim() ? (
          <div className="netflix-search-results-page">
            <h2 className="search-results-heading">
              Explore Titles for "{searchQuery}"
            </h2>
            {isSearching ? (
              <div className="netflix-loader-wrapper">
                <div className="netflix-spinner" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="netflix-search-grid">
                {searchResults.map((item) => (
                  <MovieCard
                    key={`search-${item.id}`}
                    movie={item}
                    onSelectMovie={setSelectedMovie}
                  />
                ))}
              </div>
            ) : (
              <div className="netflix-empty-search">
                <p>Your search for "{searchQuery}" did not have any matches.</p>
                <span>Suggestions:</span>
                <ul>
                  <li>Try different keywords</li>
                  <li>Looking for a movie or TV show?</li>
                  <li>Try using a movie, TV show, or actor's name</li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Billboard Hero Banner */}
            {activeTab !== "mylist" && (
              <NetflixBillboard
                movie={featuredItem}
                onPlay={(m) => setSelectedMovie({ ...m, autoPlay: true })}
                onMoreInfo={(m) => setSelectedMovie({ ...m, autoPlay: false })}
              />
            )}

            {/* Catalogue Rows Area */}
            <div className={`netflix-rows-wrapper ${activeTab === "mylist" ? "standalone-page" : ""}`}>
              {/* MY LIST VIEW */}
              {activeTab === "mylist" && (
                <section className="netflix-mylist-page">
                  <h1 className="netflix-page-title">My List</h1>
                  {myList.length > 0 ? (
                    <div className="netflix-search-grid">
                      {myList.map((item) => (
                        <MovieCard
                          key={`mylist-${item.id}`}
                          movie={item}
                          onSelectMovie={setSelectedMovie}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="netflix-empty-mylist">
                      <div className="empty-icon">＋</div>
                      <h3>You haven't added any titles to your list yet.</h3>
                      <p>
                        Explore movies and TV shows and click the ＋ button to save them to your list.
                      </p>
                      <button
                        className="browse-now-btn"
                        onClick={() => setActiveTab("home")}
                      >
                        Explore Popular Titles
                      </button>
                    </div>
                  )}
                </section>
              )}

              {/* HOME TAB: Shows All Movies and TV Series */}
              {activeTab === "home" && (
                <>
                  {myList.length > 0 && (
                    <MovieRow
                      title="My List"
                      movies={myList}
                      onSelectMovie={setSelectedMovie}
                    />
                  )}

                  <MovieRow
                    title="Trending Now"
                    movies={trendingMovies}
                    onSelectMovie={setSelectedMovie}
                  />

                  <MovieRow
                    title="Popular TV Shows"
                    movies={popularTV}
                    onSelectMovie={setSelectedMovie}
                  />

                  <MovieRow
                    title="Top Rated Movies"
                    movies={topRatedMovies}
                    onSelectMovie={setSelectedMovie}
                  />

                  <MovieRow
                    title="Binge-worthy TV Series"
                    movies={trendingTV}
                    onSelectMovie={setSelectedMovie}
                  />

                  <MovieRow
                    title="Blockbuster Action & Adventure"
                    movies={actionMovies}
                    onSelectMovie={setSelectedMovie}
                  />

                  <MovieRow
                    title="Top Rated TV Series"
                    movies={topRatedTV}
                    onSelectMovie={setSelectedMovie}
                  />

                  <MovieRow
                    title="Comedy Hits"
                    movies={comedyMovies}
                    onSelectMovie={setSelectedMovie}
                  />

                  <MovieRow
                    title="Sci-Fi & Fantasy"
                    movies={sciFiMovies}
                    onSelectMovie={setSelectedMovie}
                  />
                </>
              )}

              {/* TV SHOWS TAB */}
              {activeTab === "tv" && (
                <>
                  <div className="tab-header-banner">
                    <h1 className="netflix-page-title">TV Shows</h1>
                    <p className="tab-subtitle">
                      These days, the small screen has some very big things to say. From sitcoms to dramas to travel and talk shows, these are the best programs on TV.
                    </p>
                  </div>

                  <MovieRow
                    title="Trending TV Series"
                    movies={trendingTV}
                    onSelectMovie={setSelectedMovie}
                  />

                  <MovieRow
                    title="Popular TV Shows"
                    movies={popularTV}
                    onSelectMovie={setSelectedMovie}
                  />

                  <MovieRow
                    title="Critically Acclaimed TV Series"
                    movies={topRatedTV}
                    onSelectMovie={setSelectedMovie}
                  />
                </>
              )}

              {/* MOVIES TAB */}
              {activeTab === "movies" && (
                <>
                  <div className="tab-header-banner">
                    <h1 className="netflix-page-title">Movies</h1>
                    <p className="tab-subtitle">
                      Movies move us like nothing else can, whether they're scary, funny, dramatic, romantic or anywhere in between. So many titles, so much to experience.
                    </p>
                  </div>

                  <MovieRow
                    title="Trending Movies"
                    movies={trendingMovies}
                    onSelectMovie={setSelectedMovie}
                  />

                  <MovieRow
                    title="Top Rated Movies"
                    movies={topRatedMovies}
                    onSelectMovie={setSelectedMovie}
                  />

                  <MovieRow
                    title="Popular Movies"
                    movies={popularMovies}
                    onSelectMovie={setSelectedMovie}
                  />

                  <MovieRow
                    title="Action Movies"
                    movies={actionMovies}
                    onSelectMovie={setSelectedMovie}
                  />

                  <MovieRow
                    title="Comedy Movies"
                    movies={comedyMovies}
                    onSelectMovie={setSelectedMovie}
                  />

                  <MovieRow
                    title="Sci-Fi & Fantasy"
                    movies={sciFiMovies}
                    onSelectMovie={setSelectedMovie}
                  />
                </>
              )}

              {/* NEW & POPULAR TAB */}
              {activeTab === "new" && (
                <>
                  <div className="tab-header-banner">
                    <h1 className="netflix-page-title">New & Popular</h1>
                    <p className="tab-subtitle">
                      Stay ahead of what's buzzing across movies and series.
                    </p>
                  </div>

                  <MovieRow
                    title="Trending This Week"
                    movies={trendingMovies}
                    onSelectMovie={setSelectedMovie}
                  />

                  <MovieRow
                    title="Popular Series Right Now"
                    movies={popularTV}
                    onSelectMovie={setSelectedMovie}
                  />

                  <MovieRow
                    title="Most Watched Movies"
                    movies={popularMovies}
                    onSelectMovie={setSelectedMovie}
                  />
                </>
              )}
            </div>
          </>
        )}
      </main>

      {/* Detail / Play Trailer Modal */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {/* Logged in Netflix Footer */}
      <footer className="netflix-auth-footer">
        <div className="auth-footer-inner">
          <p className="auth-footer-questions">Questions? Call 000-800-919-1694</p>
          <div className="auth-footer-grid">
            <span>Audio Description</span>
            <span>Help Centre</span>
            <span>Gift Cards</span>
            <span>Media Centre</span>
            <span>Investor Relations</span>
            <span>Jobs</span>
            <span>Terms of Use</span>
            <span>Privacy</span>
            <span>Legal Notices</span>
            <span>Cookie Preferences</span>
            <span>Corporate Information</span>
            <span>Contact Us</span>
          </div>
          <button className="auth-footer-service-btn">Service Code</button>
          <p className="auth-footer-copyright">© 1997-2026 Netflix, Inc.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home