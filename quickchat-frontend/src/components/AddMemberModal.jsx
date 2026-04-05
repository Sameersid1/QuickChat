import React, { useState, useEffect } from "react";
import api from "../api/axios";

function AddMemberModal({ selectedChat, setSelectedChat, onClose }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
    const [addedUsers, setAddedUsers] = useState([]);

  useEffect(() => {
    const searchUsers = async () => {
      if (!search) return;

      const res = await api.get(`/users/search?search=${search}`);
      setResults(res.data.data);
    };

    searchUsers();
  }, [search]);

    const handleAdd = (user) => {
        const exists = addedUsers.find(u => u._id === user._id);
        if (exists) return;

        setAddedUsers(prev => [...prev, user]);
    };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-[#1a0f2e] p-5 rounded-xl w-[300px]">

        <h2 className="mb-3 font-semibold">Add Member</h2>

        <input
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-3 bg-[#2a1b4d] rounded"
        />

        <div className="max-h-[150px] overflow-y-auto">
          {results.map((u) => (
            <div
              key={u._id}
              onClick={() => handleAdd(u)}
              className="p-2 hover:bg-purple-700 cursor-pointer rounded"
            >
              {u.username}
            </div>
          ))}
        </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {addedUsers.map(u => (
                <span
                key={u._id}
                onClick={() =>
                    setAddedUsers(prev => prev.filter(x => x._id !== u._id))
                }
                className="bg-purple-600 px-2 py-1 rounded text-xs cursor-pointer hover:bg-purple-700"
                >
                {u.username} ✕
                </span>
            ))}
            </div>
        <button
            onClick={async () => {
            let updatedChat = selectedChat;

            for (let u of addedUsers) {
                const res = await api.post("/chat/group/add", {
                chatId: selectedChat._id,
                userId: u._id,
                });

                updatedChat = res.data.data;
            }

            setSelectedChat(updatedChat); // 🔥 IMPORTANT
            onClose();
            }}
            className="w-full bg-purple-600 py-2 rounded mt-3"
            >
            Done
        </button>
        <button onClick={onClose} className="w-full mt-3 text-gray-400">
          Close
        </button>
      </div>
    </div>
  );
}

export default AddMemberModal;