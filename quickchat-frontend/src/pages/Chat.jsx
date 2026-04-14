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
    const user=JSON.parse(localStorage.getItem("user"))

    if(user){
      socket.connect()

      socket.emit("setup",user)

    }
    return ()=> socket.disconnect()
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
      />

      <ChatArea 
          selectedChat={selectedChat}
          user={user}
          setChats={setChats}
          setSelectedChat={setSelectedChat} />

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