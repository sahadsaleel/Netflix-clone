import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import ProfileDropdown from "./ProfileDropdown"
import logo from "../assets/Netflix_Logo.png"

function Navbar({
  activeTab = "home",
  onSelectTab,
  searchQuery = "",
  onSearchChange
}) {
  const { currentUser } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showLanguages, setShowLanguages] = useState(false)
  const [language, setLanguage] = useState("English")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 30) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function handleSelectLanguage(lang) {
    setLanguage(lang)
    setShowLanguages(false)
  }

  function handleTabClick(tabKey) {
    if (onSelectTab) {
      onSelectTab(tabKey)
    }
    setMobileMenuOpen(false)
  }

  return (
    <nav className={`netflix-navbar ${isScrolled ? "scrolled" : ""} ${currentUser ? "authenticated" : "guest"}`}>
      <div className="netflix-navbar-container">
        {/* Left Side: Logo and Navigation Links */}
        <div className="netflix-navbar-left">
          <Link to="/" className="netflix-logo" aria-label="Netflix Home" onClick={() => handleTabClick("home")}>
            <img src={logo} alt="Netflix" />
          </Link>

          {/* Authenticated Primary Navigation Menu */}
          {currentUser && (
            <ul className="netflix-nav-links">
              <li
                className={`netflix-nav-item ${activeTab === "home" ? "active" : ""}`}
                onClick={() => handleTabClick("home")}
              >
                Home
              </li>
              <li
                className={`netflix-nav-item ${activeTab === "tv" ? "active" : ""}`}
                onClick={() => handleTabClick("tv")}
              >
                TV Shows
              </li>
              <li
                className={`netflix-nav-item ${activeTab === "movies" ? "active" : ""}`}
                onClick={() => handleTabClick("movies")}
              >
                Movies
              </li>
              <li
                className={`netflix-nav-item ${activeTab === "new" ? "active" : ""}`}
                onClick={() => handleTabClick("new")}
              >
                New & Popular
              </li>
              <li
                className={`netflix-nav-item ${activeTab === "mylist" ? "active" : ""}`}
                onClick={() => handleTabClick("mylist")}
              >
                My List
              </li>
            </ul>
          )}

          {/* Mobile Browse Dropdown Button */}
          {currentUser && (
            <div className="mobile-browse-menu">
              <button
                className="mobile-browse-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span>Browse</span>
                <span className="dropdown-caret">▾</span>
              </button>

              {mobileMenuOpen && (
                <div className="mobile-browse-dropdown">
                  <button
                    className={activeTab === "home" ? "active" : ""}
                    onClick={() => handleTabClick("home")}
                  >
                    Home
                  </button>
                  <button
                    className={activeTab === "tv" ? "active" : ""}
                    onClick={() => handleTabClick("tv")}
                  >
                    TV Shows
                  </button>
                  <button
                    className={activeTab === "movies" ? "active" : ""}
                    onClick={() => handleTabClick("movies")}
                  >
                    Movies
                  </button>
                  <button
                    className={activeTab === "new" ? "active" : ""}
                    onClick={() => handleTabClick("new")}
                  >
                    New & Popular
                  </button>
                  <button
                    className={activeTab === "mylist" ? "active" : ""}
                    onClick={() => handleTabClick("mylist")}
                  >
                    My List
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Search, Notifications, Profile Or Guest Controls */}
        <div className="netflix-navbar-right">
          {currentUser ? (
            <>
              {/* Expandable Search Bar */}
              <div className={`netflix-search-box ${showSearch || searchQuery ? "expanded" : ""}`}>
                <button
                  className="search-icon-btn"
                  onClick={() => setShowSearch(!showSearch)}
                  aria-label="Search movies and series"
                >
                  <svg
                    className="search-icon-svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {(showSearch || searchQuery) && (
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Titles, people, genres..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        className="search-clear-btn"
                        onClick={() => onSearchChange && onSearchChange("")}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Notification Bell */}
              <div className="netflix-notification-wrapper">
                <button
                  className="notification-bell-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-label="Notifications"
                >
                  <svg
                    className="bell-icon-svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="bell-badge">3</span>
                </button>

                {showNotifications && (
                  <div className="notification-dropdown">
                    <div className="notification-item">
                      <div className="notif-dot" />
                      <div>
                        <p className="notif-title">New Arrival</p>
                        <p className="notif-desc">Stranger Things Season 5 is coming soon!</p>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notif-dot" />
                      <div>
                        <p className="notif-title">Top 10 Today</p>
                        <p className="notif-desc">Discover what everyone is watching right now.</p>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notif-dot" />
                      <div>
                        <p className="notif-title">Continue Watching</p>
                        <p className="notif-desc">Explore new additions in your favorite genres.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Icon with Dropdown */}
              <ProfileDropdown />
            </>
          ) : (
            /* Unauthenticated Guest Navbar Controls */
            <>
              <div className="language-selector">
                <button
                  className="language-btn"
                  onClick={() => setShowLanguages(!showLanguages)}
                  aria-label="Select language"
                >
                  <svg
                    className="globe-icon"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M8 1v14M1 8h14M2.5 4.5c2 1 3.5 2.2 5.5 2.2s3.5-1.2 5.5-2.2M2.5 11.5c2-1 3.5-2.2 5.5-2.2s3.5 1.2 5.5 2.2"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </svg>
                  <span>{language}</span>
                  <span className="dropdown-caret">▾</span>
                </button>

                {showLanguages && (
                  <div className="language-dropdown-menu">
                    <button onClick={() => handleSelectLanguage("English")}>English</button>
                    <button onClick={() => handleSelectLanguage("हिन्दी")}>हिन्दी</button>
                  </div>
                )}
              </div>

              <button
                className="sign-in-btn"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar