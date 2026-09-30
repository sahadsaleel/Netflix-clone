import { useAuth } from "../context/AuthContext"

function NetflixBillboard({ movie, onPlay, onMoreInfo }) {
  const { isInMyList, addToMyList, removeFromMyList } = useAuth()

  if (!movie) {
    return (
      <div className="netflix-billboard billboard-skeleton">
        <div className="billboard-skeleton-shimmer" />
      </div>
    )
  }

  const title = movie.title || movie.name || "Featured Movie"
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
      ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
      : ""

  const inList = isInMyList(movie.id)
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "8.5"
  const matchPercent = rating ? Math.min(99, Math.round(Number(rating) * 10) + 12) : 98
  const releaseYear = movie.release_date
    ? movie.release_date.split("-")[0]
    : movie.first_air_date
      ? movie.first_air_date.split("-")[0]
      : "2024"

  function handleListToggle() {
    if (inList) {
      removeFromMyList(movie.id)
    } else {
      addToMyList(movie)
    }
  }

  return (
    <div className="netflix-billboard">
      <div
        className="billboard-bg"
        style={{
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none"
        }}
      >
        <div className="billboard-vignette" />
        <div className="billboard-bottom-gradient" />
      </div>

      <div className="billboard-content">
        <div className="billboard-badge">
          <span className="netflix-n-badge">NETFLIX</span>
          <span className="billboard-badge-text">
            {movie.media_type === "tv" || movie.first_air_date ? "SERIES" : "FILM"}
          </span>
        </div>

        <h1 className="billboard-title">{title}</h1>

        <div className="billboard-meta">
          <span className="billboard-match">{matchPercent}% Match</span>
          <span className="billboard-year">{releaseYear}</span>
          <span className="billboard-maturity">U/A 16+</span>
          <span className="billboard-quality">4K Ultra HD</span>
        </div>

        <p className="billboard-description">
          {movie.overview ||
            "An epic journey unfolding across vast worlds, full of unexpected alliances, dangerous rivalries, and breathtaking revelations."}
        </p>

        <div className="billboard-buttons">
          <button
            className="billboard-btn billboard-play-btn"
            onClick={() => onPlay && onPlay(movie)}
          >
            <span className="play-icon">▶</span> Play
          </button>

          <button
            className={`billboard-btn billboard-list-btn ${inList ? "in-list" : ""}`}
            onClick={handleListToggle}
          >
            <span className="list-icon">{inList ? "✓" : "＋"}</span>
            {inList ? "In My List" : "My List"}
          </button>

          <button
            className="billboard-btn billboard-info-btn"
            onClick={() => onMoreInfo && onMoreInfo(movie)}
          >
            <span className="info-icon">ⓘ</span> More Info
          </button>
        </div>
      </div>
    </div>
  )
}

export default NetflixBillboard
