import React from "react";

function ChatArea({ selectedChat, user }) {

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
            src={otherUser?.avatar || "/default-avatar.png"}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>
            <p className="font-semibold">{otherUser?.username}</p>
            <p className="text-xs text-purple-300">Online</p>
          </div>
        </div>

        <div className="flex gap-4 text-xl">
          📞 📹
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
    </div>
  );
}

export default ChatArea;