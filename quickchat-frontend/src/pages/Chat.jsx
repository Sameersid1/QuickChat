import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import MiniSidebar from "../components/MiniSidebar";

function Chat() {
  //state still in chat we use props
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab,setActiveTab]= useState([])

  useEffect(() => {
    const fetchChats = async () => {
      const res = await api.get("/chat");
      setChats(res.data.data);
    };
    fetchChats();
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchText) return;

      const res = await api.get(`/users/search?search=${searchText}`);
      setSearchResults(res.data.data);
    };
    searchUsers();
  }, [searchText]);

  const user = JSON.parse(localStorage.getItem("user"));

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
      />

      <ChatArea selectedChat={selectedChat} user={user} />

    </div>
  );
}

export default Chat;