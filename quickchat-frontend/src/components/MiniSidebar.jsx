import { MessageCircle, Users, Phone, Settings } from "lucide-react";

function MiniSidebar({ activeTab, setActiveTab, user }) {
  return (
    <div className="w-[85px] bg-[#140c24] flex flex-col items-center justify-between py-4 border-r border-purple-800">

      {/* 🔹 TOP: Profile */}
      <div className="flex flex-col items-center gap-4 ">

        <img
          src={user?.avatar || "/default-avatar.png"}
          onClick={() => console.log("open profile")}
          className="w-12 h-12 rounded-full object-cover border-2 border-purple-600 hover:scale-105 transition-all cursor-pointer"
        />

      </div>

      {/* 🔹 MIDDLE: Navigation */}
      <div className="flex flex-col gap-6 items-center ">

        <button
          onClick={() => setActiveTab("chats")}
          className={`p-3 rounded-xl transition-all ${
            activeTab === "chats"
              ? "bg-purple-600 text-white shadow-lg"
              : "text-purple-300 hover:bg-purple-800"
          }`}
        >
          <MessageCircle size={22} />
        </button>

        <button
          onClick={() => setActiveTab("groups")}
          className={`p-3 rounded-xl transition-all ${
            activeTab === "groups"
              ? "bg-purple-600 text-white shadow-lg"
              : "text-purple-300 hover:bg-purple-800"
          }`}
        >
          <Users size={22} />
        </button>

        <button className="p-3 rounded-xl text-purple-300 hover:bg-purple-800">
          <Phone size={22} />
        </button>
        
      </div>
      {/* 🔹 BOTTOM: Settings */}
      <button className="p-3 rounded-xl text-purple-300 hover:bg-purple-800">
        <Settings size={22} />
      </button>
    </div>
  );
}

export default MiniSidebar;