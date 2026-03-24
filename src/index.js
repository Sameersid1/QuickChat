import express from 'express'
import app from './app.js'
import cors from 'cors'
import connectDB from './db/index.js'
import dotenv from 'dotenv'

dotenv.config({
    path:'./.env'
})

const PORT=process.env.PORT || 7001

connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is listening on Port ${PORT}`)
    })
})
.catch((err)=>{
    console.log(`MongoDB connection error `,err)
    process.exit(1)
})