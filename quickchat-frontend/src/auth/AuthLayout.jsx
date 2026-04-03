import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const images = [
  "/public/quickchat-1-page.png",
  "/public/quickchat-secure.png",
  "/public/quickchat-3-page.png"
];

function AuthLayout() {
  const [index, setIndex] = useState(0);

  // Auto slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex">

      {/* LEFT SIDE (IMAGE SLIDER) */}
      <div className="hidden md:block w-1/2 relative overflow-hidden">
        
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="slide"
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* 🔥 Overlay (important) */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 to-black/80 flex flex-col justify-center items-center text-center p-10">
          
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 bg-gray-100 flex justify-center items-center">
        <Outlet />
      </div>

    </div>
  );
}

export default AuthLayout;