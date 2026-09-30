import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { currentUser, logout, myList } = useAuth()
  const navigate = useNavigate()

  const displayName = currentUser?.displayName || currentUser?.email?.split("@")[0] || "User"
  const email = currentUser?.email || "member@netflix.com"

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function handleSignOut() {
    try {
      await logout()
      navigate("/")
    } catch (err) {
      console.error("Sign out error:", err)
    }
  }

  return (
    <div
      className="netflix-profile-menu-container"
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="netflix-profile-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User Profile Menu"
        aria-expanded={isOpen}
      >
        <div className="netflix-avatar-box">
          {/* Classic Netflix Smiling Avatar */}
          <svg
            className="netflix-avatar-svg"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="4" fill="#0071eb" />
            {/* Eyes */}
            <circle cx="10" cy="12" r="2.2" fill="#ffffff" />
            <circle cx="22" cy="12" r="2.2" fill="#ffffff" />
            {/* Netflix Smile */}
            <path
              d="M9 19c2 3.5 12 3.5 14 0"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span className={`profile-caret ${isOpen ? "open" : ""}`}>▾</span>
      </button>

      {isOpen && (
        <div className="netflix-profile-dropdown">
          <div className="profile-dropdown-caret-up" />

          {/* Active User Header */}
          <div className="profile-dropdown-header">
            <div className="profile-header-user">
              <div className="netflix-avatar-box mini">
                <svg
                  className="netflix-avatar-svg"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="32" height="32" rx="4" fill="#0071eb" />
                  <circle cx="10" cy="12" r="2.2" fill="#ffffff" />
                  <circle cx="22" cy="12" r="2.2" fill="#ffffff" />
                  <path
                    d="M9 19c2 3.5 12 3.5 14 0"
                    stroke="#ffffff"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="profile-user-info">
                <span className="profile-name">{displayName}</span>
                <span className="profile-email" title={email}>{email}</span>
              </div>
            </div>
            <span className="profile-active-tag">Active</span>
          </div>

          <div className="profile-dropdown-divider" />

          {/* Secondary Profiles */}
          <div className="profile-switch-list">
            <div className="profile-switch-item" onClick={() => alert("Switched to Kids profile")}>
              <div className="netflix-avatar-box mini red">
                <svg
                  className="netflix-avatar-svg"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="32" height="32" rx="4" fill="#e50914" />
                  <circle cx="10" cy="12" r="2.2" fill="#ffffff" />
                  <circle cx="22" cy="12" r="2.2" fill="#ffffff" />
                  <path
                    d="M9 19c2 3.5 12 3.5 14 0"
                    stroke="#ffffff"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span>Kids</span>
            </div>

            <div className="profile-switch-item" onClick={() => alert("Manage Profiles opens in settings.")}>
              <span className="manage-profile-icon">✎</span>
              <span>Manage Profiles</span>
            </div>
          </div>

          <div className="profile-dropdown-divider" />

          {/* Account / Service links */}
          <div className="profile-nav-links">
            <button
              className="profile-link-item"
              onClick={() => alert(`Saved items in My List: ${myList.length}`)}
            >
              <span className="profile-link-icon">★</span>
              <span>My List ({myList.length})</span>
            </button>
            <button
              className="profile-link-item"
              onClick={() => alert(`Account Settings for: ${email}`)}
            >
              <span className="profile-link-icon">⚙</span>
              <span>Account</span>
            </button>
            <button
              className="profile-link-item"
              onClick={() => window.open("https://help.netflix.com", "_blank")}
            >
              <span className="profile-link-icon">?</span>
              <span>Help Center</span>
            </button>
          </div>

          <div className="profile-dropdown-divider" />

          {/* Sign Out */}
          <button className="profile-signout-btn" onClick={handleSignOut}>
            Sign out of Netflix
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
