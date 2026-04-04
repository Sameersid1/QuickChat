import React from "react";
import api from "../api/axios";

function Sidebar({
  chats,
  selectedChat,
  setSelectedChat,
  user,
  searchText,
  setSearchText,
  searchResults,
  setSearchResults,
  setChats
}) {
  return (
    <div className="w-[300px] bg-[#1a0f2e] border-r border-purple-900 flex flex-col">

      {/* Header */}
      <div className="p-4 text-xl font-semibold border-b border-purple-800">
        Chats
      </div>

      {/* Search */}
      <div className="p-3">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search..."
          className="w-full p-2 rounded-lg bg-[#2a1b4d] outline-none"
        />

        {searchResults.length > 0 && (
          <div className="bg-[#2a1b4d] mt-2 rounded-lg">
            {searchResults.map((u) => (
              <div
                key={u._id}
                onClick={async () => {
                  const res = await api.post("/chat", {
                    userId: u._id
                  });

                  const newChat = res.data.data;

                  setChats((prev) => {
                    const exists = prev.find(c => c._id === newChat._id);
                    if (exists) return prev;
                    return [newChat, ...prev];
                  });

                  setSelectedChat(newChat);
                  setSearchText("");
                  setSearchResults([]);
                }}
                className="p-2 hover:bg-purple-700 cursor-pointer"
              >
                {u.username}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => {
          const otherUser = chat.users?.find(
            (u) => u._id !== user._id
          );

          return (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer 
                hover:bg-purple-800 
                ${selectedChat?._id === chat._id ? "bg-purple-900" : ""}
              `}
            >
              <img
                src={otherUser?.avatar || "/default-avatar.png"}
                className="w-10 h-10 rounded-full object-cover"
              />

              <div>
                <p className="font-medium">{otherUser?.username}</p>
                <p className="text-sm text-gray-400 truncate w-[180px]">
                  {chat.latestMessage?.content || "No messages yet"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current User */}
      <div className="p-4 border-t border-purple-700 flex items-center justify-between">

        {/* LEFT: Avatar + Name */}
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || "/default-avatar.png"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-purple-300">Online</p>
          </div>
        </div>
        {/* RIGHT: Profile / Settings */}
        <button
          onClick={() => console.log("open profile")}
          className="text-purple-300 hover:text-white text-lg"
        >
          ⋮
        </button>
      </div>
    </div>
  );
}

export default Sidebar;