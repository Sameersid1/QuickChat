import React,{useState,useEffect,useRef} from "react";
import { UserPlus, UserMinus, Edit, Trash2 } from "lucide-react";
import api from "../api/axios";
import RenameGroupModal from "../components/RenameGroupModal";
import AddMemberModal from "../components/AddMemberModal";
import RemoveMemberModal from "../components/RemoveMemberModal";
import ConfirmModal from "../components/ConfirmModal"
import { socket } from "../socket/socket.js";

function ChatArea({ selectedChat, user,setChats, setSelectedChat,onlineUsers }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showRenameModal,setShowRenameModal]=useState(false)
  const [showAddModal,setShowAddModal]=useState(false)
  const [showRemoveModal, setShowRemoveModal] =useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message,setMessage]=useState("")
  const [messages,setMessages]=useState([])
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(()=>{
    const fetchMessage=async()=>{
      try{
        const {data}=await api.get(`/message/${selectedChat._id}`);
        setMessages(data.data.reverse())
      }catch(err){
        console.log(err)
      }
    }
    if(selectedChat){
      fetchMessage();
    }
  },[selectedChat])

  //listen for messages
  useEffect(()=>{
    if(!user) return;

    const handler=(newMessage)=>{
     
      if (newMessage.sender._id === user._id) return;
      setMessages((prev)=>[...prev,newMessage]);

      if (selectedChat && newMessage.chat._id === selectedChat._id) {
      socket.emit("message seen", {
        chatId: newMessage.chat._id,
        userId: user._id
      });
    }
    };
    
    socket.on("message received",handler);

    return()=>{
      socket.off("message received",handler)
    }
  },[user,selectedChat])

  //mark messages as seen
  useEffect(()=>{
    if(selectedChat && user){
      socket.emit("message seen",{
        chatId: selectedChat._id,
        userId:user._id
      })
    }
  },[selectedChat,user])

  useEffect(()=>{
    if(!selectedChat) return;
    socket.emit("join chat",selectedChat._id);

    return()=>{
      socket.emit("leave chat",selectedChat._id)
    }
  },[selectedChat])
  

  useEffect(() => {
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));

      return () => {
        socket.off("typing");
        socket.off("stop typing");
      };
    }, []);

    useEffect(() => {
  socket.on("message seen", ({ chatId, userId }) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.chat._id !== chatId) return msg;

        const alreadySeen = msg.seenBy?.some((s) => {
          const id = typeof s === "object" ? s._id?.toString() : s?.toString();
          return id === userId?.toString();
        });

        if (alreadySeen) return msg; // ← prevents duplicate entries

        return {
          ...msg,
          seenBy: [...(msg.seenBy || []), userId],
        };
      })
    );
  });
  return () => socket.off("message seen");
}, []);

  let typingTimeoutRef=useRef(null);
    const typingHandler=(e)=>{
      setMessage(e.target.value);
      
      if(!socket.connected || !selectedChat) return;

      if(!typing){
        setTyping(true);
        socket.emit("typing",selectedChat._id)
      }
      //clear old timer
        if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }, 3000);
        
    }
  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
        Welcome to QuickChat !! <br />
        Select a chat to start messaging
      </div>
    );
  }


  const otherUser = selectedChat.users?.find(
  (u) => u._id?.toString() !== user._id?.toString()
);

  const sendMessage=async ()=>{
    if(!message.trim()) return;

    try{
      const {data}=await api.post("/message",{
        content: message,
        chatId: selectedChat._id,
      })
      console.log("Message sent: ",data)
      setMessages((prev)=>[...prev,data.data])
      setMessage("")
      setChats((prev) => {
      const filtered = prev.filter(c => c._id !== selectedChat._id);

      const updatedChat = {
        ...selectedChat,
        latestMessage: data.data,
      };
      console.log("Chats after update:", prev);
      return [updatedChat, ...filtered];
        });
      }catch(err){
          console.log(err)
      }
  }
  
    const isSeenByOther = (msg) => {
  if (!msg.seenBy) return false;
  return msg.seenBy.some((s) => {
    const id = typeof s === "object" ? s._id?.toString() : s?.toString();
    return id && id !== user._id.toString();
  });
};
const isOnline = otherUser && onlineUsers.includes(otherUser._id.toString());
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
            {!selectedChat.isGroupChat && isOnline && (
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            )}
            <p className="text-xs text-purple-300">
              {selectedChat.isGroupChat
                ? selectedChat.users
                    ?.filter((u) => u._id !== user._id)
                    .map((u) => u.username)
                    .join(", ")
                : isOnline ? "Online" : "Offline"}
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
  {messages.map((msg) => (
    <div
      key={msg._id}
      className={`p-3 rounded-lg w-fit max-w-xs ${
        msg.sender?._id === user._id
          ? "bg-purple-600 ml-auto"
          : "bg-[#4d075c]"
      }`}
    >
      <div className="flex items-center gap-1">
        
        {/* message text */}
        <span>{msg.content}</span>

        {/* ticks only for sender */}
        {msg.sender?._id === user._id && (
  <span className="text-xs text-gray-300">
    {isSeenByOther(msg) ? "✔️✔️" : "✔️"}
  </span>
)}

      </div>
    </div>
  ))}
</div>
      {isTyping && (
  <div className="text-sm text-gray-400 px-4 pb-2">
    Typing...
  </div>
)}
      {/* Input */}
      <div className="p-4 border-t border-purple-900 flex items-center gap-3">

        <label className="cursor-pointer text-xl px-2">
          ➕
          <input type="file" className="hidden" />
        </label>

        <input
          type="text"
          value={message}
          onChange={typingHandler}
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-full bg-[#2a1b4d]"
        />

        <button
          onClick={sendMessage} 
          className="bg-purple-600 px-4 py-2 rounded-full">
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