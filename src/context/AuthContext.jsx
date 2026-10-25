import { createContext, useContext, useState, useEffect } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../firebase"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [myList, setMyList] = useState([])

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)

      if (user) {
        // Save user session in sessionStorage
        try {
          sessionStorage.setItem(
            "netflix_user",
            JSON.stringify({ email: user.email, uid: user.uid })
          )
        } catch (e) {
          console.error("Error saving session to sessionStorage:", e)
        }

        // Load user's saved list from localStorage
        try {
          const savedList = localStorage.getItem(`netflix_my_list_${user.uid}`)
          if (savedList) {
            setMyList(JSON.parse(savedList))
          } else {
            setMyList([])
          }
        } catch (err) {
          console.error("Error reading My List from localStorage:", err)
          setMyList([])
        }
      } else {
        sessionStorage.removeItem("netflix_user")
        setMyList([])
      }
    })

    return () => unsubscribe()
  }, [])

  // Save myList whenever it changes
  function updateMyList(newList) {
    setMyList(newList)
    if (currentUser?.uid) {
      try {
        localStorage.setItem(`netflix_my_list_${currentUser.uid}`, JSON.stringify(newList))
      } catch (err) {
        console.error("Error saving My List:", err)
      }
    }
  }

  function addToMyList(item) {
    if (!item) return
    const exists = myList.some((m) => m.id === item.id)
    if (!exists) {
      const updated = [item, ...myList]
      updateMyList(updated)
    }
  }

  function removeFromMyList(itemId) {
    const updated = myList.filter((m) => m.id !== itemId)
    updateMyList(updated)
  }

  function isInMyList(itemId) {
    return myList.some((m) => m.id === itemId)
  }

  async function logout() {
    try {
      await signOut(auth)
      sessionStorage.removeItem("netflix_user")
    } catch (err) {
      console.error("Sign out error:", err)
      throw err
    }
  }

  const value = {
    currentUser,
    loading,
    logout,
    myList,
    addToMyList,
    removeFromMyList,
    isInMyList
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
