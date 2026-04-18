import express from 'express'
import app from './app.js'
import cors from 'cors'
import http from "http"
import { Server } from "socket.io";
import connectDB from './db/index.js'
import dotenv from 'dotenv'
import Chat from './models/chat.models.js';
import Message from './models/message.models.js'

dotenv.config()

const PORT=process.env.PORT || 7001

const server=http.createServer(app)

const io = new Server(server, {                     //Now this server supports real-time communication
    cors: {                                         //Any frontend (React, etc.) can connect to this socket
        origin: true,
        credentials: true,
        methods: ["GET", "POST"]
    }
});

// ✅ CRITICAL: handle preflight BEFORE routes
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    
    return res.sendStatus(200);
  }
  next();
});
                                                        //emit → send event      //on → listen for event
app.set("io", io);                                //We can use socket inside controllers later

const onlineUsers=new Set();

io.on("connection", (socket) => {                      //Whenever a user opens your app → this runs  //(socket) Each user gets their own socketid
    console.log("User connected:", socket.id);         //Prints unique ID of user

    socket.on("join chat",(chatId)=>{                      ////Backend is listening for event from frontend
        socket.join(chatId);                 
        console.log("User joined chat",chatId)
    })

    socket.on("typing",(chatId)=>{
        socket.to(chatId).emit("typing")
    })

    socket.on("stop typing",(chatId)=>{
        socket.to(chatId).emit("stop typing");
    })

    socket.on("setup",(user)=>{
        socket.join(user._id);   
        socket.userId = user._id;

        onlineUsers.add(user._id.toString());

        socket.emit("online users",Array.from(onlineUsers));
        
        socket.broadcast.emit("user online", user._id);
    })
    socket.on("disconnect",()=>{
        console.log("User disconnected: ",socket.userId);
        if (socket.userId) {
        onlineUsers.delete(socket.userId.toString());
        socket.broadcast.emit("user offline",socket.userId);
        }
    }) 


    socket.on("message seen",async({chatId,userId})=>{            //Find all messages in this chat BUT not sent by me   → add me to seenBy
        try{
            await Message.updateMany(
            {
                chat:chatId,
                sender:{$ne:userId}
            },
            {
                $addToSet:{seenBy:userId,
                    deliveredTo:userId
                }
            }
        );
        await Chat.findByIdAndUpdate(chatId,{
            $set:{[`unreadCount.${userId}`]:0}
        })
        //notify other
        io.to(chatId).emit("message seen", {
  chatId,
  userId
});
        }catch(error){
            console.log("DB failed ",error)
        }
    })
    socket.on("leave chat",(chatId)=>{
        socket.leave(chatId);
        console.log("User left chat ",chatId)
    })
    
});
//Socket.io lets backend and frontend stay connected all the time
connectDB()
.then(()=>{
    server.listen(PORT, () => {
    console.log(`Server is listening on Port ${PORT}`);
    });
})
.catch((err)=>{
    console.log(`MongoDB connection error `,err)
    process.exit(1)
})