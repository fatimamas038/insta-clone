import mongoose from "mongoose"
const {ObjectId}=mongoose.Schema.Types
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
   email:{
       type:String,
       required:true,
   },
   password:{
       type:String,
    required:true,
   },
   followers:[{type:ObjectId,ref:"User"}],
   following:[{type:ObjectId,ref:"User"}],
   pic:{
       type:String,
       default:"https://res.cloudinary.com/ddf8agjjc/image/upload/v1621334380/images_jabmvk.jpg"
   }
})

const User=mongoose.model("User",userSchema)
export default User