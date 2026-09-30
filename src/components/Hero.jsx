import { useState } from "react"
import { useNavigate } from "react-router-dom"
import heroBg from "../assets/netflix-background-img.jpg"

function Hero() {
  const [email, setEmail] = useState("")
  const navigate = useNavigate()

  function handleGetStarted(e) {
    e.preventDefault()
    if (email.trim()) {
      navigate("/signup", { state: { email: email.trim() } })
    } else {
      navigate("/signup")
    }
  }

  return (
    <section className="hero">
      <div
        className="hero-background"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      <div className="hero-overlay" />

      <div className="hero-content">
        <h2 className="hero-title">Watch it before someone spoils it</h2>

        <p className="hero-price">Starts at ₹149. Cancel anytime.</p>

        <p className="hero-subtext">
          Ready to watch? Enter your email to create or restart your membership.
        </p>

        <form className="hero-form" onSubmit={handleGetStarted}>
          <input
            type="email"
            className="hero-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="hero-submit-btn">
            Get Started
            <span className="btn-arrow">›</span>
          </button>
        </form>
      </div>

      <div className="hero-arc-container">
        <div className="hero-arc" />
      </div>
    </section>
  )
}

export default Hero