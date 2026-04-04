import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./auth/AuthLayout";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Chat from "./pages/Chat"
function App() {
  const token = localStorage.getItem("token");
  return (
    <BrowserRouter>
      <Routes>

        {/* THIS IS IMPORTANT */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

        </Route>
        <Route
          path="/chat"
          element={token ? <Chat /> : <Navigate to="/login" />}
        />
        
        {/* ✅ If token exists → go to chat */}
        <Route
          path="/login"
          element={token ? <Navigate to="/chat" /> : <Login />}
        />

        {/* ✅ Protected route */}
        <Route
          path="/chat"
          element={token ? <Chat /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;