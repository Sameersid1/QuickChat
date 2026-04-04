import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Chat from "../pages/Chat.jsx"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  const handleLogin=async()=>{
    try{
      const res=await api.post("/users/login",{
        email,
        password
      });
      console.log("FULL RESPONSE:", res);
      const token=res.data.data.token
      console.log(res.data);
      localStorage.setItem("token",token)
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      console.log("Login successful")

      
      navigate("/Chat");

    }catch(err){
      console.log("ERROR:", err);
      console.log(err.response?.data?.message);
    }
  }
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
      
      <h2 className="text-2xl font-bold text-center mb-6 animate-fadeUp">
        Welcome Back 👋
      </h2>

      <input
        type="email"
        placeholder="Enter your email"
        className="w-full p-3 mb-4 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:scale-[1.02] transition"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter your password"
        className="w-full p-3 mb-4 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:scale-[1.02] transition"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex justify-between text-sm mb-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          Remember me
        </label>
        <span className="text-purple-600 cursor-pointer hover:underline">
          Forgot Password?
        </span>
      </div>

      <button onClick={handleLogin} 
            className="w-full bg-purple-950 hover:bg-purple-800 hover:scale-105 text-white p-3 rounded-lg transition">
        Login
      </button>

      <p className="text-center text-sm mt-4">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-purple-600">
          Create Account
        </Link>
      </p>
    </div>
  );
}

export default Login;