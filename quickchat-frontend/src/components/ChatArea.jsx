import React,{useState} from "react";
import { UserPlus, UserMinus, Edit, Trash2 } from "lucide-react";
import api from "../api/axios";
import RenameGroupModal from "../components/RenameGroupModal";
import AddMemberModal from "../components/AddMemberModal";
import RemoveMemberModal from "../components/RemoveMemberModal";
import ConfirmModal from "../components/ConfirmModal"
function ChatArea({ selectedChat, user,setChats, setSelectedChat }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showRenameModal,setShowRenameModal]=useState(false)
  const [showAddModal,setShowAddModal]=useState(false)
  const [showRemoveModal, setShowRemoveModal] =useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
        Welcome to QuickChat !! <br />
        Select a chat to start messaging
      </div>
    );
  }

  const otherUser = selectedChat.users?.find(
    (u) => u._id !== user._id
  );

  return (
    <div className="flex-1 flex flex-col">

      {/* Header */}
      <div className="p-4 border-b border-purple-900 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <img
            src={selectedChat?.isGroupChat? selectedChat.avatar: otherUser?.avatar}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>
            <p className="font-semibold">
              {selectedChat.isGroupChat
                ? selectedChat.chatName
                : otherUser?.username}
            </p>
            <p className="text-xs text-purple-300">
              {selectedChat.isGroupChat
                ? selectedChat.users
                    ?.filter((u) => u._id !== user._id)
                    .map((u) => u.username)
                    .join(", ")
                : "Online"}
            </p>
          </div>
        </div>

        <div className="flex gap-4 text-xl items-center relative">
        📞 📹

          {/* 3-dot button */}
          {selectedChat?.isGroupChat && (
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-purple-300 hover:text-white text-lg"
            >
              ⋮
            </button>
          )}

          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute right-0 top-10 bg-[#1f1235] border border-purple-800 rounded-xl shadow-lg py-2 w-44 z-50">

              <button
                onClick={() => {
                  setShowAddModal(true);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-purple-700"
              >
                <UserPlus size={16} />
                Add Member
              </button>

              <button
                onClick={() => {
                  setShowRemoveModal(true);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-purple-700"
              >
                <UserMinus size={16} />
                Remove Member
              </button>

              <button
                onClick={() => {
                  setShowRenameModal(true);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-purple-700"
              >
                <Edit size={16} />
                Rename
              </button>

              <div className="border-t border-purple-800 my-1" />

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white"
              >
                <Trash2 size={16} />
                Delete
              </button>

            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        <div className="bg-[#4d075c] p-3 rounded-lg w-fit max-w-xs">
          The new mocks look great in purple.
        </div>

        <div className="bg-purple-600 p-3 rounded-lg w-fit max-w-xs ml-auto">
          Hey team, review the new assets when you can.
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-purple-900 flex items-center gap-3">

        <label className="cursor-pointer text-xl px-2">
          ➕
          <input type="file" className="hidden" />
        </label>

        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-full bg-[#2a1b4d]"
        />

        <button className="bg-purple-600 px-4 py-2 rounded-full">
          Send
        </button>
      </div>
      {/* ✅ MODALS (CORRECT PLACE) */}

{showRenameModal && (
  <RenameGroupModal
    selectedChat={selectedChat}
    setChats={setChats}
    setSelectedChat={setSelectedChat}
    onClose={() => setShowRenameModal(false)}
  />
)}

{showAddModal && (
  <AddMemberModal
    selectedChat={selectedChat}
    setSelectedChat={setSelectedChat}
    onClose={() => setShowAddModal(false)}
  />
)}

{showRemoveModal && (
  <RemoveMemberModal
    selectedChat={selectedChat}
    setSelectedChat={setSelectedChat}
    user={user}
    onClose={() => setShowRemoveModal(false)}
  />
)}

  {showDeleteConfirm && (
  <ConfirmModal
    title="Delete Group"
    message={`Are you sure you want to delete "${selectedChat.chatName}"?`}
    onClose={() => setShowDeleteConfirm(false)}
    onConfirm={async () => {
      await api.delete(`/chat/group/${selectedChat._id}`);

      setChats(prev => prev.filter(c => c._id !== selectedChat._id));
      setSelectedChat(null);
      setShowDeleteConfirm(false);
      setTimeout(() => {
    setSelectedChat(null);
  }, 0);
    }}
  />
)}
    </div>
  );
}

export default ChatArea;