import { io } from "socket.io-client";

const URL = "http://localhost:7000"; //backend

export const socket = io(URL, {
  autoConnect: false,
});

//Prevents multiple connections
//Central control of socket