import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate, useLocation, Link } from "react-router-dom"
import logo from "../assets/Netflix_Logo.png"

function Signup() {
  const location = useLocation()
  const initialEmail = location.state?.email || ""

  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

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
                type="password"
                className="auth-input"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div className="auth-field">
              <input
                id="signup-confirm-password"
                type="password"
                className="auth-input"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
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