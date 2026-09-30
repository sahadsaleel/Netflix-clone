import { useRef } from "react"

function TrendingRow({ movies = [] }) {
  const containerRef = useRef(null)

  function scroll(direction) {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -600 : 600

      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      })
    }
  }

  return (
    <section className="trending-section">
      <div className="trending-inner">

        <h2 className="trending-heading">
          Trending Now
        </h2>

        <div className="trending-wrapper">

          <button
            className="carousel-btn carousel-btn-left"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            ‹
          </button>

          <div
            className="trending-container"
            ref={containerRef}
          >
            {movies
              .filter((movie) => movie && (movie.poster_path || movie.backdrop_path))
              .slice(0, 10)
              .map((movie, index) => (
                <div
                  className="trending-card"
                  key={movie.id}
                >
                  <span className="ranking-number">
                    {index + 1}
                  </span>

                  <div className="poster-wrapper">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path || movie.backdrop_path}`}
                      alt={movie.title || movie.name || "Trending Movie"}
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
          </div>

          <button
            className="carousel-btn carousel-btn-right"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            ›
          </button>

        </div>

      </div>
    </section>
  )
}

export default TrendingRow