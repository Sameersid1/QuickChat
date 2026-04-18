import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"

const app=express()
app.get("/", (req, res) => {
  res.send("ROOT WORKING");
});
//cors configuration
//Browser ko clearly bata rahe ho ki kaun-kaun se frontend, kaise, kis type ke request bhej sakte hain.
const allowedOrigins = [
  "http://localhost:5173"
];
app.use(cors({
    origin: allowedOrigins,
    credentials:true,                                                              //Browser ko allow karta hai ki cookies, sessions, auth headers backend ke saath send ho sakein.
    methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders:["Content-Type","Authorization"]          //in postman
}))

//basic configuration
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))



//common middleware
app.use(cookieParser())

//import the routes

import healthCheckRouter from "./routes/healthcheck.routes.js"
import userRouter from "./routes/user.routes.js"
import chatRouter from "./routes/chat.routes.js"
import messageRouter from "./routes/message.routes.js"
import notificationRouter from "./routes/notiification.routes.js"

//routes

app.use("/api/v1/healthcheck",healthCheckRouter)
app.use("/api/v1/users",userRouter)
app.use("/api/v1/chat",chatRouter)
app.use("/api/v1/message",messageRouter)
app.use("/api/v1/notification",notificationRouter)
app.get("/test", (req, res) => {
  res.send("Backend working");
});
app.use((req, res) => {
  console.log("❌ UNKNOWN ROUTE:", req.method, req.url);
  res.status(404).send("Route not found");
});

// Global Error Handler (VERY IMPORTANT)
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});
export default app