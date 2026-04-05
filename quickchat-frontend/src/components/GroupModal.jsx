import React, { useState, useEffect } from "react";
import api from "../api/axios";

function GroupModal({ setShowGroupModal, chats, setChats }) {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [avatar, setAvatar] = useState(null);

  // 🔍 Search Users
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchText) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await api.get(`/users/search?search=${searchText}`);
        setSearchResults(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    searchUsers();
  }, [searchText]);

  // ➕ Add user
  const handleAddUser = (user) => {
    const exists = selectedUsers.find(u => u._id === user._id);
    if (exists) return;

    setSelectedUsers(prev => [...prev, user]);
  };

  // ❌ Remove user
  const handleRemoveUser = (userId) => {
    setSelectedUsers(prev => prev.filter(u => u._id !== userId));
  };

  // 🚀 Create Group
  const createGroup = async () => {
  try {
    const formData = new FormData();

    formData.append("name", groupName);
    formData.append("users", JSON.stringify(selectedUsers.map(u => u._id)));

    if (avatar) {
      formData.append("avatar", avatar);
    }

    const res = await api.post("/chat/group", formData);
      console.log(res.data.data);
    setChats(prev => [res.data.data, ...prev]);
    setShowGroupModal(false);

  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

      <div className="bg-[#1a0f2e] p-5 rounded-xl w-[320px]">

        <h2 className="mb-3 font-semibold">Create Group</h2>

        {/* Group Name */}
        <input
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full p-2 mb-3 bg-[#2a1b4d] rounded"
        />

        {/* Search Users */}
        <input
          placeholder="Search users..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full p-2 mb-2 bg-[#2a1b4d] rounded"
        />

        {/* Search Results */}
        <div className="max-h-[100px] overflow-y-auto mb-2">
          {searchResults.map((u) => (
            <div
              key={u._id}
              onClick={() => handleAddUser(u)}
              className="p-2 hover:bg-purple-700 cursor-pointer rounded"
            >
              {u.username}
            </div>
          ))}
        </div>

        {/* Selected Users */}
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedUsers.map((u) => (
            <div
              key={u._id}
              className="bg-purple-600 px-2 py-1 rounded text-xs flex items-center gap-1"
            >
              {u.username}
              <span
                onClick={() => handleRemoveUser(u._id)}
                className="cursor-pointer"
              >
                ✕
              </span>
            </div>
          ))}
        </div>
        {avatar && (
        <img
            src={URL.createObjectURL(avatar)}
            className="w-12 h-12 rounded-full mb-2"
        />
        )}
        <label className="cursor-pointer block mb-3">
            <span className="text-sm text-purple-300">Upload Group Avatar</span>
            <input
                type="file"
                className="hidden"
                onChange={(e) => setAvatar(e.target.files[0])}
            />
        </label>

        {/* Buttons */}
        <button
          onClick={createGroup}
          className="w-full bg-purple-600 py-2 rounded"
        >
          Create
        </button>

        <button
          onClick={() => setShowGroupModal(false)}
          className="w-full mt-2 text-sm text-gray-400"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}

export default GroupModal;