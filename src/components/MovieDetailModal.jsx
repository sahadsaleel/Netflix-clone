import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { getMediaTrailer } from "../api/movieApi"

function MovieDetailModal({ movie, onClose }) {
  const { isInMyList, addToMyList, removeFromMyList } = useAuth()
  const [trailerKey, setTrailerKey] = useState(null)
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(Boolean(movie?.autoPlay))
  const [loadingTrailer, setLoadingTrailer] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchTrailer() {
      if (!movie) return
      setLoadingTrailer(true)
      const mediaType = movie.media_type || (movie.first_air_date ? "tv" : "movie")
      const key = await getMediaTrailer(mediaType, movie.id)
      if (isMounted) {
        setTrailerKey(key)
        setLoadingTrailer(false)
        if (movie?.autoPlay && key) {
          setIsPlayingTrailer(true)
        }
      }
    }

    fetchTrailer()

    // Close on escape key
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      isMounted = false
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [movie, onClose])

  if (!movie) return null

  const title = movie.title || movie.name || "Untitled"
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : ""

  const inList = isInMyList(movie.id)
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "8.4"
  const matchPercent = rating ? Math.min(99, Math.round(Number(rating) * 10) + 12) : 96
  const isSeries = movie.media_type === "tv" || !!movie.first_air_date
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
    <div className="netflix-modal-backdrop" onClick={onClose}>
      <div
        className="netflix-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="netflix-modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="netflix-modal-media">
          {isPlayingTrailer && trailerKey ? (
            <div className="netflix-video-responsive">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&rel=0&enablejsapi=1`}
                title={`${title} Official Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                className="netflix-exit-trailer-btn"
                onClick={() => setIsPlayingTrailer(false)}
                title="Back to Preview"
              >
                Back to Preview
              </button>
            </div>
          ) : (
            <div
              className="netflix-modal-image-hero"
              style={{
                backgroundImage: backdropUrl ? `url(${backdropUrl})` : "none"
              }}
            >
              <div className="modal-hero-overlay" />
              <div className="modal-hero-title-area">
                <h2 className="modal-media-title">{title}</h2>
                <div className="modal-quick-actions">
                  {loadingTrailer ? (
                    <button className="modal-play-btn loading" disabled>
                      <span className="mini-spinner" /> Loading Trailer...
                    </button>
                  ) : trailerKey ? (
                    <button
                      className="modal-play-btn"
                      onClick={() => setIsPlayingTrailer(true)}
                    >
                      ▶ Play Trailer
                    </button>
                  ) : (
                    <button
                      className="modal-play-btn"
                      onClick={() => alert(`Official trailer is currently processing for ${title}.`)}
                    >
                      ▶ Play
                    </button>
                  )}

                  <button
                    className={`modal-circle-btn ${inList ? "active" : ""}`}
                    onClick={handleListToggle}
                    title={inList ? "Remove from My List" : "Add to My List"}
                  >
                    {inList ? "✓" : "＋"}
                  </button>

                  <button
                    className="modal-circle-btn"
                    title="I like this"
                    onClick={(e) => {
                      e.currentTarget.classList.toggle("liked")
                    }}
                  >
                    👍
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="netflix-modal-body">
          <div className="modal-body-left">
            <div className="modal-info-row">
              <span className="modal-match">{matchPercent}% Match</span>
              <span className="modal-year">{releaseYear}</span>
              <span className="modal-badge-maturity">16+</span>
              <span className="modal-duration">
                {isSeries ? "2 Seasons" : "2h 14m"}
              </span>
              <span className="modal-badge-hd">HD</span>
            </div>

            <p className="modal-overview">
              {movie.overview ||
                "No description is available for this title right now, but it is trending among viewers worldwide."}
            </p>
          </div>

          <div className="modal-body-right">
            <div className="modal-meta-item">
              <span className="meta-label">Type:</span>
              <span className="meta-val">{isSeries ? "TV Series" : "Movie"}</span>
            </div>
            <div className="modal-meta-item">
              <span className="meta-label">Rating:</span>
              <span className="meta-val">★ {rating} / 10</span>
            </div>
            <div className="modal-meta-item">
              <span className="meta-label">Audio:</span>
              <span className="meta-val">English, Hindi [Original]</span>
            </div>
            <div className="modal-meta-item">
              <span className="meta-label">Subtitles:</span>
              <span className="meta-val">English, Hindi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetailModal
