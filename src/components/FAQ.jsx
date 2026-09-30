import { useState } from "react"
import { useNavigate } from "react-router-dom"

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const [email, setEmail] = useState("")
  const navigate = useNavigate()

  const questions = [
    {
      question: "What is Netflix?",
      answer:
        "Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries and more on thousands of internet-connected devices.\n\nYou can watch as much as you want, whenever you want, without a single ad – all for one low monthly price. There's always something new to discover, and new TV shows and movies are added every week!"
    },
    {
      question: "How much does Netflix cost?",
      answer:
        "Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from ₹149 to ₹649/month. No extra costs, no contracts."
    },
    {
      question: "Where can I watch?",
      answer:
        "Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web at netflix.com from your personal computer or on any internet-connected device that offers the Netflix app, including smart TVs, smartphones, tablets, streaming media players and game consoles.\n\nYou can also download your favourite shows with the iOS or Android app. Use downloads to watch while you're on the go and without an internet connection. Take Netflix with you anywhere."
    },
    {
      question: "How do I cancel?",
      answer:
        "Netflix is flexible. There are no annoying contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime."
    },
    {
      question: "What can I watch on Netflix?",
      answer:
        "Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want."
    },
    {
      question: "Is Netflix good for kids?",
      answer:
        "The Netflix Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and films in their own space.\n\nKids profiles come with PIN-protected parental controls that let you restrict the maturity rating of content kids can watch and block specific titles you don't want kids to see."
    }
  ]

  function toggleFAQ(index) {
    setOpenIndex(openIndex === index ? null : index)
  }

  function handleCtaSubmit(e) {
    e.preventDefault()
    if (email.trim()) {
      navigate("/signup", { state: { email: email.trim() } })
    } else {
      navigate("/signup")
    }
  }

  return (
    <section className="faq-section" id="faq">
      <div className="faq-inner">
        <h2 className="faq-heading">Frequently Asked Questions</h2>

        <div className="faq-list">
          {questions.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div className="faq-item" key={index}>
                <button
                  className="faq-question-btn"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className={`faq-icon ${isOpen ? "open" : ""}`}>
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="faq-answer-box">
                    {item.answer.split("\n\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="faq-cta">
          <p className="faq-cta-text">
            Ready to watch? Enter your email to create or restart your membership.
          </p>

          <form className="faq-form" onSubmit={handleCtaSubmit}>
            <input
              type="email"
              className="faq-input"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="faq-submit-btn">
              Get Started
              <span className="btn-arrow">›</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default FAQ