import { useState } from "react"

function Footer() {
  const [language, setLanguage] = useState("English")
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  function handleSelectLanguage(lang) {
    setLanguage(lang)
    setShowLanguageMenu(false)
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        
        <p className="footer-top-text">
          Questions? Call{" "}
          <a href="tel:000-800-919-1743" className="footer-phone-link">
            000-800-919-1743
          </a>
        </p>

        <div className="footer-links-grid">
          <ul className="footer-column">
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#investor">Investor Relations</a></li>
            <li><a href="#privacy">Privacy</a></li>
            <li><a href="#speed-test">Speed Test</a></li>
          </ul>

          <ul className="footer-column">
            <li><a href="#help">Help Centre</a></li>
            <li><a href="#jobs">Jobs</a></li>
            <li><a href="#cookies">Cookie Preferences</a></li>
            <li><a href="#legal">Legal Notices</a></li>
          </ul>

          <ul className="footer-column">
            <li><a href="#account">Account</a></li>
            <li><a href="#ways-to-watch">Ways to Watch</a></li>
            <li><a href="#corporate">Corporate Information</a></li>
            <li><a href="#only-on-netflix">Only on Netflix</a></li>
          </ul>

          <ul className="footer-column">
            <li><a href="#media">Media Centre</a></li>
            <li><a href="#terms">Terms of Use</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-language-wrapper">
          <button
            className="footer-language-btn"
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
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

          {showLanguageMenu && (
            <div className="footer-language-menu">
              <button onClick={() => handleSelectLanguage("English")}>
                English
              </button>
              <button onClick={() => handleSelectLanguage("हिन्दी")}>
                हिन्दी
              </button>
            </div>
          )}
        </div>

        <p className="footer-region">Netflix India</p>

        <p className="footer-recaptcha">
          This page is protected by Google reCAPTCHA to ensure you're not a bot.
        </p>
      </div>
    </footer>
  )
}

export default Footer