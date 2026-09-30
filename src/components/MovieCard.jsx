import { useAuth } from "../context/AuthContext"

function MovieCard({ movie, onSelectMovie }) {
  const { isInMyList, addToMyList, removeFromMyList } = useAuth()
  if (!movie) return null

  const title = movie.title || movie.name || "Untitled"
  const image = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : "https://via.placeholder.com/300x450/141414/ffffff?text=No+Poster"

  const type = movie.media_type === "tv" || movie.first_air_date ? "TV Show" : "Movie"
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null
  const matchPercent = rating ? Math.min(99, Math.round(Number(rating) * 10) + 12) : 95
  const inList = isInMyList(movie.id)

  function handleListToggle(e) {
    e.stopPropagation()
    if (inList) {
      removeFromMyList(movie.id)
    } else {
      addToMyList(movie)
    }
  }

  return (
    <div
      className="netflix-movie-card"
      onClick={() => onSelectMovie && onSelectMovie(movie)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelectMovie && onSelectMovie(movie)
        }
      }}
    >
      <div className="netflix-card-poster">
        <img
          src={image}
          alt={title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = "https://via.placeholder.com/300x450/141414/ffffff?text=No+Poster"
          }}
        />
        {rating && rating > 0 && (
          <span className="netflix-card-badge">★ {rating}</span>
        )}
      </div>

      <div className="netflix-card-overlay">
        <div className="netflix-card-actions">
          <button
            className="netflix-mini-btn play-mini-btn"
            title="Play"
            onClick={(e) => {
              e.stopPropagation()
              onSelectMovie && onSelectMovie({ ...movie, autoPlay: true })
            }}
          >
            ▶
          </button>
          <button
            className={`netflix-mini-btn list-mini-btn ${inList ? "active" : ""}`}
            title={inList ? "Remove from My List" : "Add to My List"}
            onClick={handleListToggle}
          >
            {inList ? "✓" : "＋"}
          </button>
          <button
            className="netflix-mini-btn info-mini-btn"
            title="More Info"
            onClick={(e) => {
              e.stopPropagation()
              onSelectMovie && onSelectMovie(movie)
            }}
          >
            ℹ
          </button>
        </div>

        <h4 className="netflix-card-title">{title}</h4>

        <div className="netflix-card-metadata">
          <span className="netflix-match-score">{matchPercent}% Match</span>
          <span className="netflix-type-badge">{type}</span>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
