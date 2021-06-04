import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from "../App"
import {useParams} from 'react-router-dom'

const Profile  = ()=>{
    const [userProfile,setProfile] = useState(null)
    const [pics,setPic]=useState([])
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
  const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
    useEffect(()=>{
      async function fetchProfile(){
       await fetch(`/user/${userid}`,{
          headers:{
                        "authorization":"Bearer "+localStorage.getItem("jwt")
                    }
                }).then(res=>res.json())
                .then(result=>{
                   console.log(result);
                  setProfile(result)
                   
                     console.log(userProfile);
                })

      }
       
       fetchProfile()
    },[userid])
    console.log(userProfile);

    const followUser=()=>{
fetch("/follow",{
  method:"put",
  headers:{
    "Content-Type":"application/json",
"authorization":"Bearer "+localStorage.getItem("jwt")
  },
  body:JSON.stringify({
    followid:userid
  })
}).then(res=>res.json())
.then(data=>{
 console.log(data);
 dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
 localStorage.setItem("user",JSON.stringify(data))
 setProfile((prevState)=>{
   return{
     ...prevState,
     user:{
       ...prevState.user,
       followers:[...prevState.user.followers,data._id]
     }
   }
 })
 setShowFollow(false)
})
    }

    const unfollowUser=()=>{
      fetch("/unfollow",{
        method:"put",
        headers:{
          "Content-Type":"application/json",
      "authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          unfollowid:userid
        })
      }).then(res=>res.json())
      .then(data=>{
       console.log(data);
       dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
       localStorage.setItem("user",JSON.stringify(data))
       setProfile((prevState)=>{
        const removefollower=prevState.user.followers.filter(item=>item!=data._id)
         return{
           ...prevState,
           user:{
             ...prevState.user,
             followers:removefollower
           }
         }
       })
       
      })
      setShowFollow(true)
          }

    return (
      <>
{userProfile?

  <div style={{maxWidth:"550px",margin:"0px auto"}}>
        <div style={{display:"flex",justifyContent:"space-around",margin:"18px 0px",
        borderBottom:"1px solid gray"}}>
            <div>
      <img style={{width:"180px",borderRadius:"80px",height:"180px",objectFit:"cover",marginTop:"10px"}} src={userProfile.user.pic}/>       
            </div>
            <div><h4>{userProfile.user.name}</h4>
            <h5>{userProfile.user.email}</h5>
            <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
            <h6>{userProfile.posts.length} posts</h6>
         
            <h6>{userProfile.user.followers.length} followers</h6>
            <h6>{userProfile.user.following.length} following</h6>
            </div>
            {showfollow?
              <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>followUser()}
            >
                Follow
            </button>:
            <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>unfollowUser()}
            >
                unfollow
            </button>}
            
            
            </div>
           
        </div>
      <div className="gallery">
      {userProfile.posts.map(item=>{
          return (
            <img className="item" src={item.photo}></img>
          )
      })}
      
     
     </div>  
        </div>

 :<h2>loading...!!!</h2>}

      </>
       
    )

}

export default Profile