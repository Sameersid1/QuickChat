import React,{useState} from "react";
import api from "../api/axios";

function RemoveMemberModal({ selectedChat, setSelectedChat, user, onClose }) {
  const [selectedUser, setSelectedUser] = useState(null);

  const members = selectedChat.users.filter(u => u._id !== user._id);

  const handleRemove = async (userId) => {
    console.log("Removing user:", userId);
    const res = await api.post("/chat/group/remove", {
      chatId: selectedChat._id,
      userId,
    });

    setSelectedChat(res.data.data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-[#1a0f2e] p-5 rounded-xl w-[300px]">

        <h2 className="mb-3 font-semibold">Remove Member</h2>

        {members.map((u, index) => (
          <div
            key={u._id || index}
            onClick={() => setSelectedUser(u)}
            className="p-2 hover:bg-red-600 cursor-pointer rounded"
          >
            {u.username}
          </div>
        ))}

        {selectedUser && (
          <div className="mt-3 bg-[#2a1b4d] p-3 rounded">
            <p className="text-sm">
              Remove {selectedUser.username}?
            </p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 bg-gray-600 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await handleRemove(selectedUser._id)
                  setSelectedUser(null)
                  onClose();
                }}
                className="flex-1 bg-red-600 py-1 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        <button onClick={onClose} className="w-full mt-3 text-gray-400">
          Close
        </button>
      </div>
    </div>
  );
}

export default RemoveMemberModal;