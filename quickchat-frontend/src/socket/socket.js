import { io } from "socket.io-client";

const URL = "https://quickchat-backend-0gnj.onrender.com"; //backend

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"],
});

//Prevents multiple connections
//Central control of socket