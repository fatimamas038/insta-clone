import React, { useState,useEffect } from 'react'
import {Link,useHistory} from "react-router-dom"
import axios from "axios"
import M from "materialize-css"



const Signup = () => {
   const history=useHistory();
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPasword]=useState("")
    const [url,setUrl]=useState(undefined)
    const [image,setImage]=useState("")

    useEffect(()=>{
if(url){
uploadFields()
}
    },[url])
    const uploadPic=()=>{
        const data = new FormData()
       data.append("file",image)
       data.append("upload_preset","insta-clone")
       data.append("cloud_name","ddf8agjjc")
       fetch("https://api.cloudinary.com/v1_1/ddf8agjjc/image/upload",{
           method:"post",
           body:data
       })
       .then(res=>res.json())
       .then(data=>{
          setUrl(data.url)
       })
       .catch(err=>{
           console.log(err)
       })
    }

    const uploadFields=()=>{
        const config={
            headers:{"content-type":"application/json"}
        }
    
    axios.post("/signup", { name,email,password,pic:url })
    .then((response) =>{console.log(response.data.message)
    M.toast({html:response.data.message,classes:"#43a047 green darken-1"})
    history.push("/login")
    }
    )
    .catch(err => {
        // what now?
        if (err.response) {
            // client received an error response (5xx, 4xx)
            console.log(err.response.data);
            M.toast({html:err.response.data.error,classes:"#c62828 red darken-3"})
          } else if (err.request) {
            // client never received a response, or request never left
          } else {
            // anything else
          }
    })
       setName("")
       setEmail("")
       setPasword("")
    }

const PostData=()=>{
    if(image){
        uploadPic()
    }else{
uploadFields()
    }
  
}

    return (
        <div className="mycard">
        <div className="card auth-card input-field">
          <h2>Instagram</h2>
          <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          />
           <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          />
          <input
          type="password"
          placeholder="password"
           value={password}
          onChange={(e)=>setPasword(e.target.value)}
          />
          <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1">
                <span>Uplaod Image</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
          <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={()=>PostData()}

          >
              Signup
          </button>
          <h5>
              <Link to="/login">Already have an account ?</Link>
          </h5>
          <h6>
              {/* <Link to="/reset">Forgot password ?</Link> */}
          </h6>
  
      </div>
    </div>
  
    )
}

export default Signup
