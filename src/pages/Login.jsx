import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate, Link } from "react-router-dom"
import logo from "../assets/Netflix_Logo.png"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  
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
                type="password"
                className="auth-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
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