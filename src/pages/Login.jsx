import { useState, useEffect } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import logo from "../assets/Netflix_Logo.png"

function Login() {
  const { currentUser, loading: authLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
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
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Incorrect email or password. Please try again or create an account."
      case "auth/invalid-email":
        return "Please enter a valid email address."
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later."
      case "auth/network-request-failed":
        return "Network connection failed. Please check your internet connection."
      default:
        return defaultMsg ? defaultMsg.replace(/^Firebase:\s*/, "") : "Invalid email or password."
    }
  }

  async function handleLogin(e) {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password) {
      setError("Please enter both email and password.")
      return
    }

    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      navigate("/")
    } catch (err) {
      console.error("Login error:", err)
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
          <h1 className="auth-title">Sign In</h1>

          {error && <div className="auth-alert">{error}</div>}

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-field">
              <input
                id="login-email"
                type="email"
                className="auth-input"
                placeholder="Email or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                className="auth-input has-toggle"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye slash / hide icon
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
                  // Eye open / show icon
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
              id="login-submit-btn"
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="auth-footer-prompt">
            <span className="auth-footer-text">New to Netflix? </span>
            <Link to="/signup" className="auth-footer-link">
              Sign up now
            </Link>
          </div>

          <p className="auth-notice">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Login