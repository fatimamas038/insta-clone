import React,{useEffect,useState,useContext} from 'react'
import { UserContext } from '../App'
import M from 'materialize-css'

const Profile = () => {
    const {state,dispatch}=useContext(UserContext)
    console.log(state);
    const [pics,setPics]=useState([])
    const [url,setUrl]=useState("")
    const [image,setImage]=useState("")
    useEffect(()=>{
fetch("/mypost",{
    headers:{
        "authorization":"Bearer "+localStorage.getItem("jwt")
    }
}).then(res=>res.json())
.then(result=>{
console.log(result);
setPics(result.mypost)

   console.log(pics);
})
    },[])
useEffect(()=>{
if(image){
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
       
       console.log(data);
       
       fetch("/updatepic",{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            pic:data.url
        })
    }).then(res=>res.json())
    .then(data=>{

       if(data.error){
          M.toast({html: data.error,classes:"#c62828 red darken-3"})
       }
       else{
        localStorage.setItem("user",JSON.stringify({...state,pic:data.pic}))
        dispatch({type:"UPDATEPIC",payload:data.pic})
           M.toast({html:"updated profile picture Successfully",classes:"#43a047 green darken-1"})
    
       }
    }).catch(err=>{
        console.log(err)
    })
    })
    .catch(err=>{
        console.log(err)
    })
}
},[image])
    const updatePhoto=(file)=>{
        setImage(file)
      console.log(image);  
    }
    
    return (
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
        <div style={{display:"flex",justifyContent:"space-around",margin:"18px 0px",
        }}>
            <div>
      <img style={{width:"160px",borderRadius:"80px",height:"180px",objectFit:"cover"}} src={state?state.pic:"loading"}/>       
            </div>
             <div>
             <h4>{state?state.name:"loading"}</h4>
             <h4>{state?state.email:"loading"}</h4>
            <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}> 
            <h6>{pics.length} posts</h6>
         <h6>{state?state.followers.length:0} followers</h6>
            <h6>{state?state.following.length:0} following</h6>
            </div>
            </div>
             </div>
             <div className="file-field input-field">
            <div className="btn #263238 blue-grey darken-4">
                <span>Update Image</span>
                <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
            <div style={{borderBottom:"1px solid gray",marginBottom:"10px"}}></div>

       
      <div className="gallery">
      {pics.map(item=>{
          return (
            <img className="item" src={item.photo}></img>
          )
      })}
      
     
     </div>  
        </div>
    )
}

export default Profile
