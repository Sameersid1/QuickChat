import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Pencil } from "lucide-react";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get("/users/current-user");
      setUser(res.data.data);
      setBio(res.data.data.bio || ""); // ✅ FIX
    };

    fetchUser();
  }, []);

  const handleSaveBio = async () => {
    try {
      await api.put("/users/profile", { bio });

      // ✅ update UI instantly
      setUser((prev) => ({ ...prev, bio }));

      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) return <div>Loading...</div>;

  // ✅ First name extract
  const firstName = user.fullname?.split(" ")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0a1f] to-[#1a1033] flex items-center justify-center px-4">
      
      <div className="bg-[#1e1538] text-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative">

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt="avatar"
            className="w-28 h-28 rounded-full border-4 border-purple-600 shadow-lg -mt-16 object-cover"
          />

          {/* Name */}
          <h2 className="text-2xl font-bold mt-4">{firstName}</h2>

          {/* Username */}
          <p className="text-purple-300">@{user.username}</p>
        </div>

        {/* Email */}
        <div className="mt-6 bg-[#140c24] p-4 rounded-xl">
          <p className="text-sm text-gray-300">
            <span className="text-purple-400 font-semibold">Email:</span> {user.email}
          </p>
        </div>

        {/* 🔥 Bio Section */}
        <div className="mt-4 bg-[#140c24] p-4 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-400 font-semibold">Bio</span>

            <Pencil
              size={16}
              className="cursor-pointer hover:text-purple-300"
              onClick={() => setIsEditing(true)}
            />
          </div>

          {isEditing ? (
            <>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 rounded-lg bg-[#1e1538] text-white outline-none"
                rows={3}
              />

              <button
                onClick={handleSaveBio}
                className="mt-2 bg-purple-600 px-3 py-1 rounded-lg"
              >
                Save
              </button>
            </>
          ) : (
            <p className="text-gray-300 text-sm">
              {user.bio || "Click ✏️ to add bio"}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 bg-purple-600 hover:bg-purple-700 transition py-2 rounded-xl font-semibold">
            Edit Profile
          </button>

          <button className="flex-1 bg-gray-700 hover:bg-gray-800 transition py-2 rounded-xl">
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;