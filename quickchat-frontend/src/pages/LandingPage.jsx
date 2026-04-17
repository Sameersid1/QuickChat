import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full relative text-white overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-br from-[#0b0014] via-[#140028] to-black"></div>

      <div className="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] bg-purple-700/30 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[500px] h-[500px] bg-purple-500/20 blur-[150px] rounded-full"></div>
      <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-indigo-500/20 blur-[120px] rounded-full"></div>

      {/* 🔝 Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-6">
        <h1 className="text-2xl font-semibold text-[#c084fc] tracking-wide">
          QuickChat
        </h1>

        <ul className="hidden md:flex gap-10 text-gray-300 text-sm">
          <li className="hover:text-white cursor-pointer">Home</li>
          <li className="hover:text-white cursor-pointer">About</li>
          <li className="hover:text-white cursor-pointer">Contact</li>
        </ul>

        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 rounded-xl border border-purple-500/40 
          text-purple-200 hover:bg-purple-800/30 backdrop-blur-md transition"
        >
          Login
        </button>
      </nav>

      {/*Hero Section */}
      <div className="relative z-10 flex items-center justify-center h-[85%] px-6">

        {/* Glass Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 
        rounded-3xl px-12 py-14 text-center shadow-2xl">

          <p className="text-xs tracking-[0.3em] text-gray-400 mb-4">
            INTRODUCING
          </p>

          <h1 className="text-5xl md:text-6xl font-bold text-[#e9d5ff] 
          drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]">
            QuickChat
          </h1>

          <p className="mt-6 text-gray-300 max-w-md mx-auto">
            Experience lightning-fast messaging with a sleek, modern interface.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex justify-center gap-6">

            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 rounded-xl 
              bg-gradient-to-r from-[#9333ea] to-[#6b21a8] 
              hover:from-[#7e22ce] hover:to-[#581c87]
              shadow-lg shadow-purple-900/40 transition"
            >
              Get Started
            </button>

            <button
              className="px-8 py-3 rounded-xl border border-purple-400/40 
              text-purple-200 hover:bg-purple-800/30 backdrop-blur-md transition"
            >
              Learn More
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default LandingPage;