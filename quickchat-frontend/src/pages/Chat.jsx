import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import MiniSidebar from "../components/MiniSidebar";
import GroupModal from "../components/GroupModal";
import { useNavigate,Navigate  } from "react-router-dom";
import { socket } from "../socket/socket.js";

function Chat({setToken}) {
  //state still in chat we use props
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab,setActiveTab]= useState("chats")
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [user, setUser] = useState(null);
  const [onlineUsers,setOnlineUsers]=useState([])

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  
  useEffect(() => {
    if (!token) return;
    const fetchChats = async () => {
      try{
        const res = await api.get("/chat");
        setChats(res.data.data);
      }catch(err){
        console.log(err)
      }
    };
    fetchChats();
  }, [token]);

  useEffect(() => {
    const searchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!searchText || !token) return;

      try{
        const res = await api.get(`/users/search?search=${searchText}`);
        setSearchResults(res.data.data);
      }catch(err){
        console.log(err)
      }
    };
    searchUsers();
  }, [searchText]);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    navigate("/login"); // ✅ redirect instead of loading forever
    return;
  }
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
  }, []);
  
  useEffect(()=>{
    if(user){
      socket.connect()
      socket.emit("setup",user)

    }
    return ()=> socket.disconnect()
  },[user])


useEffect(() => {
  if (!user) return;

  const handler = ({ chatId }) => {

    //if already in that chat → ignore
    if (selectedChat?._id === chatId) return;

    setChats((prev) => {
      const updated = prev.map((chat) => {
        if (chat._id !== chatId) return chat;

        return {
          ...chat,
          unreadCount: {
            ...chat.unreadCount,
            [user._id]: (chat.unreadCount?.[user._id] || 0) + 1
          }
        };
      });

      // moves chat to top
      const chatToTop = updated.find(c => c._id === chatId);
      const rest = updated.filter(c => c._id !== chatId);

      return [chatToTop, ...rest];
    });
  };

  socket.on("new notification", handler);

  return () => socket.off("new notification", handler);
}, [user, selectedChat]);

useEffect(() => {
  if (!selectedChat || !user) return;

  setChats((prev) =>
    prev.map((chat) => {
      if (chat._id !== selectedChat._id) return chat;

      return {
        ...chat,
        unreadCount: {
          ...chat.unreadCount,
          [user._id]: 0
        }
      };
    })
  );
}, [selectedChat]);

  useEffect(()=>{
    if(!user) return;

    //full list on connect
    socket.on("online users",(users)=>{
      setOnlineUsers(users);
    })

    //single user online
    socket.on("user online",(userId)=>{
      setOnlineUsers((prev)=>[...new Set([...prev,userId])])
    })

    //user offline
    socket.on("user offline",(userId)=>{
      setOnlineUsers((prev)=>prev.filter(id=>id!==userId))
    })
    return ()=>{
      socket.off("online users");
      socket.off("user online");
      socket.off("user offline");
    }
  },[user])

  useEffect(() => {
  if (!token) {
    navigate("/login");
  }
}, [token]);
  
  if (!user) return <div>Loading...</div>;
  return (
    <div className="flex h-screen bg-[#0f0f1a] text-white">

      <MiniSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
      />

      <Sidebar
        chats={chats}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        user={user}
        searchText={searchText}
        setSearchText={setSearchText}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        setChats={setChats}
        setShowGroupModal={setShowGroupModal}
        activeTab={activeTab}
        setToken={setToken}
        onlineUsers={onlineUsers} 
      />

      <ChatArea 
          selectedChat={selectedChat}
          user={user}
          setChats={setChats}
          setSelectedChat={setSelectedChat} 
          onlineUsers={onlineUsers}
          />

      {showGroupModal && (
      <GroupModal
        setShowGroupModal={setShowGroupModal}
        chats={chats}
        setChats={setChats}
      />
    )}
    </div>
  );
}

export default Chat;