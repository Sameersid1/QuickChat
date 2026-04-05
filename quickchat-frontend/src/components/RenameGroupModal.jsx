import React, { useState } from "react";
import api from "../api/axios";

function RenameGroupModal({ selectedChat, setChats, setSelectedChat, onClose }) {
  const [name, setName] = useState(selectedChat.chatName);

  const handleRename = async () => {
    if (!name) return;

    const res = await api.post("/chat/group/rename", {
      chatId: selectedChat._id,
      name,
    });

    setChats(prev =>
      prev.map(c => c._id === selectedChat._id ? res.data.data : c)
    );

    setSelectedChat(res.data.data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-[#1a0f2e] p-5 rounded-xl w-[300px]">

        <h2 className="mb-3 font-semibold">Rename Group</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-3 bg-[#2a1b4d] rounded"
        />

        <button onClick={handleRename} className="w-full bg-purple-600 py-2 rounded">
          Save
        </button>

        <button onClick={onClose} className="w-full mt-2 text-gray-400">
          Cancel
        </button>

      </div>
    </div>
  );
}

export default RenameGroupModal;