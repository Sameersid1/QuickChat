import React, { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
      
      <h2 className="text-2xl font-bold text-center mb-6">
        Create Account 🚀
      </h2>

      <input
        type="text"
        placeholder="Full Name"
        className="w-full p-3 mb-3 rounded-lg border focus:ring-2 focus:ring-purple-500 transition"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Username"
        className="w-full p-3 mb-3 rounded-lg border focus:ring-2 focus:ring-purple-500 transition"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 mb-3 rounded-lg border focus:ring-2 focus:ring-purple-500 transition"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 mb-4 rounded-lg border focus:ring-2 focus:ring-purple-500 transition"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="w-full bg-purple-950 hover:bg-purple-800 hover:scale-105 text-white p-3 rounded-lg transition">
        Sign Up
      </button>

      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-purple-600">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Signup;