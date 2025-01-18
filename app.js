import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "./models/user.js"
import userRoutes from "./routes/userRoute.js"
import postRoute from "./routes/postRoute.js"
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const app=express()

const PORT=process.env.PORT||5000


// Get the file URL to path
const __filename = fileURLToPath(import.meta.url);
// Get the directory name
const __dirname = path.dirname(__filename);


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

// const __dirname=path.resolve()
// app.use("/uploads",express.static(path.join(__dirname,"/uploads")))

if(process.env.NODE_ENV==="production"){
app.use(express.static(path.join(__dirname,"/client/build")))    
app.get("*",(req,res)=>
res.sendFile(path.resolve(__dirname,"client","build","index.html")))
}else{
  app.get("/",(req,res)=>{
      res.send("API is running....")
  })  
}

app.listen(PORT,()=>{
    console.log("server is running on port",PORT)
})