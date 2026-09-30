import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

function App() {
  return (
    <AuthProvider>
      <div className="netflix-app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App