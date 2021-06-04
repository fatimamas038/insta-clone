import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "./models/user.js"
import userRoutes from "./routes/userRoute.js"
import postRoute from "./routes/postRoute.js"
dotenv.config();

const app=express()

const PORT=5000

const conn= await mongoose.connect(process.env.MONGO_URI,{
    useUnifiedTopology:true,
  useNewUrlParser:true,
  useCreateIndex:true
  })
  console.log(`Mongodb connected: ${conn.connection.host}`);
const customMiddleware=(req,res,next)=>{
    console.log("middle ware executed");
    next()
}
app.use(express.json())
app.use(customMiddleware)

app.use("/",userRoutes)
app.use("/",postRoute)

app.listen(PORT,()=>{
    console.log("server is running on port",PORT)
})