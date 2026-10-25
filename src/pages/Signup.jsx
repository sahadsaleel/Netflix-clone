import { useState, useEffect } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import logo from "../assets/Netflix_Logo.png"

function Signup() {
  const { currentUser, loading: authLoading } = useAuth()
  const location = useLocation()
  const initialEmail = location.state?.email || ""

  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  // Handle Session: If user is already logged in, redirect to home page
  useEffect(() => {
    if (!authLoading && currentUser) {
      navigate("/", { replace: true })
    }
  }, [currentUser, authLoading, navigate])

  function getErrorMessage(errorCode, defaultMsg) {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "This email is already in use. Please sign in or use another email."
      case "auth/invalid-email":
        return "Please enter a valid email address."
      case "auth/weak-password":
        return "Password must be at least 6 characters long."
      case "auth/network-request-failed":
        return "Network connection failed. Please check your internet connection."
      default:
        return defaultMsg ? defaultMsg.replace(/^Firebase:\s*/, "") : "Failed to create account. Please try again."
    }
  }

  async function handleSignup(e) {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password) {
      setError("Please fill in all fields.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    if (confirmPassword && password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password)
      navigate("/")
    } catch (err) {
      console.error("Signup error:", err)
      setError(getErrorMessage(err.code, err.message))
    } finally {
      setLoading(false)
    }
  }

  // Show loader while checking session
  if (authLoading) {
    return (
      <div className="netflix-page-loader">
        <div className="netflix-spinner" />
        <span className="netflix-loader-text">NETFLIX</span>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-overlay" />

      <header className="auth-header">
        <Link to="/" className="auth-logo">
          <img src={logo} alt="Netflix" />
        </Link>
      </header>

      <main className="auth-main">
        <div className="auth-box">
          <h1 className="auth-title">Sign Up</h1>

          {error && <div className="auth-alert">{error}</div>}

          <form className="auth-form" onSubmit={handleSignup}>
            <div className="auth-field">
              <input
                id="signup-email"
                type="email"
                className="auth-input"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                className="auth-input has-toggle"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <div className="auth-field">
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                className="auth-input has-toggle"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <button
              id="signup-submit-btn"
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="auth-footer-prompt">
            <span className="auth-footer-text">Already have an account? </span>
            <Link to="/login" className="auth-footer-link">
              Sign In now
            </Link>
          </div>

          <p className="auth-notice">
            Sign up is protected by Google reCAPTCHA to ensure you're not a bot.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Signup