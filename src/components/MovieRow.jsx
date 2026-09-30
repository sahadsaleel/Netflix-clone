import { useRef } from "react"
import MovieCard from "./MovieCard"

function MovieRow({ title, movies = [], onSelectMovie }) {
  const rowRef = useRef(null)

  function scroll(direction) {
    if (rowRef.current) {
      const scrollAmount = direction === "left" ? -750 : 750
      rowRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      })
    }
  }

  // Filter items that have posters or backdrops
  const validMovies = (movies || []).filter(
    (item) => item && (item.poster_path || item.backdrop_path)
  )

  if (validMovies.length === 0) {
    return null
  }

  return (
    <section className="netflix-row-section">
      <div className="netflix-row-inner">
        <h2 className="netflix-row-title">{title}</h2>

        <div className="netflix-row-wrapper">
          <button
            className="netflix-nav-arrow arrow-left"
            onClick={() => scroll("left")}
            aria-label={`Scroll ${title} left`}
          >
            ‹
          </button>

          <div className="netflix-row-container" ref={rowRef}>
            {validMovies.map((movie) => (
              <MovieCard
                key={`${movie.media_type || "item"}-${movie.id}`}
                movie={movie}
                onSelectMovie={onSelectMovie}
              />
            ))}
          </div>

          <button
            className="netflix-nav-arrow arrow-right"
            onClick={() => scroll("right")}
            aria-label={`Scroll ${title} right`}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}

export default MovieRow