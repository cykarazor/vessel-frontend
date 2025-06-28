import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Voyages from "./pages/Voyages";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // "login" or "register"

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return authMode === "login" ? (
      <>
        <LoginForm onLogin={handleLogin} />
        <button onClick={() => setAuthMode("register")}>Switch to Register</button>
      </>
    ) : (
      <>
        <RegisterForm />
        <button onClick={() => setAuthMode("login")}>Switch to Login</button>
      </>
    );
  }

  return <Voyages user={user} onLogout={handleLogout} />;
}

export default App;
