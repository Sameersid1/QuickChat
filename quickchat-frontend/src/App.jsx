import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthLayout from "./auth/AuthLayout";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Chat from "./pages/Chat";
import VerifyEmail from "./pages/VerifyEmail";
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./pages/LandingPage";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={token ? <Navigate to="/chat" /> : <Login setToken={setToken} />}
          />
          <Route path="/signup" element={<Signup setToken={setToken}/>} />
        </Route>

        <Route
            path="/chat"
            element={token ? <Chat setToken={setToken} /> : <Navigate to="/login" />}
          />

        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;