import express from "express"
import User from "../models/user.js"
import Post from "../models/posts.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {authmiddleware} from "../middleware/requirelogin.js"


const router=express.Router()


router.post("/signup",(req,res)=>{
   const {name,email,password,pic}=req.body
   console.log("signup executing");
   if(!name ||!email||!password){ 
        
    return res.status(404).json({error:"please enter all the fields"})
}else{
    User.findOne({email:email}).then((savedUser)=>{
        if(savedUser){
            return res.status(404).json({error:"user already exists"}).status(404)
    
        }
bcrypt.hash(password,12)
.then(hashedPasssword=>{
    const user=new User({
        email,
        password:hashedPasssword,
        name,
        pic
    })
    user.save()
    .then(user=>{
        res.json({message:"saved successfully"})
})
.catch(err=>{
    console.log(err);
})
})  

})
}
})

router.post("/signin",(req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
       return res.status(404).json({error:"please enter both the fields"})
 }
 User.findOne({email:email},(err,savedUser)=>{
    console.log(savedUser);
    console.log(email);
    
    
  if(!savedUser){
    console.log("I am in if block");
    
      res.json({error:"invalid user"})
  }
     else{
bcrypt.compare(password,savedUser.password)
.then(doMatch=>{
    if(doMatch){
        //res.json({message:"successfully logged in"})
const token=jwt.sign({_id:savedUser._id},process.env.JWT_SECRET)
const {_id,name,email,followers,following,pic} = savedUser
               res.json({token,user:{_id,name,email,followers,following,pic}})
    }
    else{
        res.json({error:"invalid user or password"})
    }
    if(err){
        console.log(err);
    }
})
}
 })
 
})

router.get("/user/:id",authmiddleware,(req,res)=>{
    console.log(req.params.id);
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
         .populate("postedBy","_id name")
         .exec((err,posts)=>{
             if(err){
                 return res.status(422).json({error:err})
             }
         res.json({user,posts})
        })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})

router.get("/protected",(req,res)=>{
    var id="609947b69b0652a3c4d212f1"
    User.findById(id, function (err, docs) {
        if (err){
            console.log(err);
        }
        else{
            console.log("Result : ", docs);
        }
    })
})

router.put("/follow",authmiddleware,(req,res)=>{
    User.findByIdAndUpdate(req.body.followid,{
        $push:{followers:req.user._id}
    },{new:true},(err,result)=>{
        if(err){
        return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followid}
        },{new:true})
        .select("-password")
.then(result=>{
    res.json(result)
}).catch(err=>{
    return res.status(422).json({error:err})
})
    })
})
router.put("/unfollow",authmiddleware,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowid,{
        $pull:{followers:req.user._id}
    },{new:true},(err,result)=>{
        if(err){
        return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowid}
        },{new:true})
        .select("-password")
.then(result=>{
    res.json(result)
    
}).catch(err=>{
    return res.status(422).json({error:err})
})
    })
})

router.put("/updatepic",authmiddleware,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{pic:req.body.pic},{
        new:true},(err,result)=>{
            if(err){
                return res.status(404).json({error:err})
            }
            if(result){
                return res.status(200).json(result)
            }
        })
})

router.post("/search",(req,res)=>{
 let userPattern=new RegExp("^"+req.body.query)   
    User.find({email:{$regex:userPattern}})
    .select("_id email")
    .then(user=>{
        res.json({user})
    })
    .catch(err=>{
        console.log(err);
    })
})

export default router