function FeatureCards() {
  const features = [
    {
      title: "Enjoy on your TV",
      description:
        "Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.",
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="tvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e5097f" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <rect
            x="8"
            y="12"
            width="48"
            height="32"
            rx="4"
            stroke="url(#tvGrad)"
            strokeWidth="3"
            fill="#120b22"
          />
          <rect
            x="12"
            y="16"
            width="40"
            height="24"
            rx="2"
            fill="url(#tvGrad)"
            fillOpacity="0.25"
          />
          <path
            d="M26 44L21 54H43L38 44"
            stroke="url(#tvGrad)"
            strokeWidth="3"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )
    },
    {
      title: "Download your shows to watch offline",
      description:
        "Save your favourites easily and always have something to watch.",
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="downGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#c026d3" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="23" fill="url(#downGrad)" />
          <circle
            cx="32"
            cy="32"
            r="27"
            stroke="#f472b6"
            strokeWidth="2"
            strokeOpacity="0.4"
          />
          <path
            d="M32 20V38M32 38L24 30M32 38L40 30"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M23 44H41"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )
    },
    {
      title: "Watch everywhere",
      description:
        "Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.",
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
          </defs>
          <path
            d="M16 48L33 16L41 21L24 53L16 48Z"
            fill="url(#beamGrad)"
          />
          <circle cx="43" cy="18" r="6" fill="#f43f5e" />
          <path
            d="M44 14L56 7M48 20L60 23M41 24L50 35"
            stroke="#f472b6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      )
    },
    {
      title: "Create profiles for kids",
      description:
        "Send kids on adventures with their favourite characters in a space made just for them — free with your membership.",
      icon: (
        <svg width="68" height="64" viewBox="0 0 68 64" fill="none">
          <defs>
            <linearGradient id="kidsGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
            <linearGradient id="kidsGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
          </defs>
          <rect x="6" y="16" width="30" height="30" rx="6" fill="url(#kidsGrad1)" />
          <circle cx="15" cy="27" r="2.5" fill="#3b0764" />
          <circle cx="27" cy="27" r="2.5" fill="#3b0764" />
          <path
            d="M17 35C19 38 23 38 25 35"
            stroke="#3b0764"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="30" y="26" width="32" height="30" rx="6" fill="url(#kidsGrad2)" />
          <circle cx="40" cy="38" r="2.5" fill="#ffffff" />
          <circle cx="52" cy="38" r="2.5" fill="#ffffff" />
          <path
            d="M42 46C44 48 48 48 50 46"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )
    }
  ]

  return (
    <section className="features-section">
      <div className="features-inner">
        <h2 className="features-heading">More reasons to join</h2>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
              <div className="feature-icon">{feature.icon}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureCards