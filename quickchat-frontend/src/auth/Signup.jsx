import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js"
import { Upload } from "lucide-react";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  const handleSignup=async ()=>{
  try{
    const formData = new FormData();

    formData.append("fullname", fullName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar); 

    const res = await api.post("/users/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(res.data);
    alert("Signup successful");

  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    alert("Signup failed");
  }
}
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
      
      <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Upload Avatar
      </label>

      <div className="flex items-center gap-3">
        
        {/* Hidden Input */}
        <input
          type="file"
          accept="image/*"
          id="avatarInput"
          className="hidden"
          onChange={(e) => setAvatar(e.target.files[0])}
        />

        {/* Custom Button */}
        <label
          htmlFor="avatarInput"
          className="flex items-center gap-2 cursor-pointer bg-purple-900 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition hover:scale-105"
        >
          <Upload size={18} />
          Upload Avatar
        </label>

        {/* File Name */}
        <span className="text-sm text-gray-600">
          {avatar ? avatar.name : "No file chosen"}
        </span>
        
      </div>
    </div>
      <button onClick={handleSignup}
              className="w-full bg-purple-950 hover:bg-purple-800 hover:scale-105 text-white p-3 rounded-lg transition"  
      >
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