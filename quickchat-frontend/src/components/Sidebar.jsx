import React,{useState} from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Sidebar({
  chats,
  selectedChat,
  setSelectedChat,
  user,
  searchText,
  setSearchText,
  searchResults,
  setSearchResults,
  setChats,
  setShowGroupModal,
  activeTab,
  setToken
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const filteredChats =
  activeTab === "groups"
    ? chats.filter(chat => chat.isGroupChat)
    : chats;

  const handleLogout = async () => {
  try {
    await api.post("/users/logout");
  } catch (err) {
    console.log(err);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null); // VERY IMPORTANT
    delete api.defaults.headers.common["Authorization"];
    navigate("/login", { replace: true });
  }
};

  const navigate = useNavigate();

  return (
    <div className="w-[300px] bg-[#1a0f2e] border-r border-purple-900 flex flex-col">

      {/* Header */}
      <div className="p-4 text-xl font-semibold border-b border-purple-800">
        Chats
      </div>

      <div className="px-3 mt-2">
      <button
        onClick={() => setShowGroupModal(true)}
        className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg text-sm"
      >
        + New Group
      </button>
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
        {filteredChats.map((chat) => {
          if (!user || !chat?.users) return null;
          const isGroup = chat.isGroupChat;
          const otherUser = chat.users?.find(
            (u) => u?._id?.toString() !== user?._id?.toString()
          );
          if (!otherUser && !chat.isGroupChat) return null;
          const name = isGroup
            ? chat.chatName
            : otherUser?.username;

          const avatar = isGroup
            ? chat.avatar
            : otherUser?.avatar;
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
                src={avatar || "/default-avatar.png"}
                className="w-10 h-10 rounded-full"
              />

              <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-400 truncate w-[180px]">
                  {chat.latestMessage?.content || "No messages yet"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current User */}
<div className="p-4 border-t border-purple-700 flex items-center justify-between relative">

  {/* LEFT */}
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

  {/* RIGHT: 3 dots */}
  <button
    onClick={(e) => {
      e.stopPropagation(); // important
      setOpenMenu(!openMenu);
    }}
    className="text-purple-300 hover:text-white text-lg px-2"
  >
    ⋮
  </button>

  {/* Dropdown */}
  {openMenu && (
    <div className="absolute bottom-14 right-4 w-36 bg-[#1e1538] border border-purple-700 rounded-xl shadow-lg z-50">
      
      <button
        onClick={() => {
          navigate("/profile");
          setOpenMenu(false);
        }}
        className="w-full text-left px-4 py-2 hover:bg-[#2a1d4d]"
      >
        Profile
      </button>

      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-red-400 hover:bg-[#2a1d4d]"
      >
        Logout
      </button>

    </div>
  )}
</div>
    </div>
  );
}

export default Sidebar;