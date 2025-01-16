import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from "../App"
import {Link} from "react-router-dom"

const Home = () => {
  const [data,setData]=useState([])
  const {state,dispatch}=useContext(UserContext)
  useEffect(()=>{
fetch("/allpost",{
  headers:{
    "authorization":"Bearer "+localStorage.getItem("jwt")
  }
}).then(res=>res.json())
.then(result=>{
  console.log(result.posts);
  setData(result.posts)
})
  },[])

const likePost=(id)=>{
fetch("/like",{
  method:"put",
  headers:{
    "Content-Type":"application/json",
    "authorization":"Bearer "+localStorage.getItem("jwt")
  },
  body:JSON.stringify({
    postId:id
  })
}).then(res=>res.json())
.then(result=>{
  //console.log(result);
  const newData=data.map(item=>{
    if(item._id===result._id){
      return result
    }else{
      return item
    }
  })
  setData(newData)
})
}

const unlikePost=(id)=>{
  fetch("/unlike",{
    method:"put",
    headers:{
      "Content-Type":"application/json",
      "authorization":"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({
      postId:id
    })
  }).then(res=>res.json())
  .then(result=>{
   // console.log(result);
   const newData=data.map(item=>{
    if(item._id===result._id){
      return result
    }else{
      return item
    }
  })
  setData(newData)
  })
  }

  const makeComment=(text,postId)=>{
fetch("/comment",{
  method:"put",
  headers:{
    "Content-Type":"application/json",
    "authorization":"Bearer "+localStorage.getItem("jwt")
  },body:JSON.stringify({
    postId,
    text
  })
}).then(res=>res.json())
.then(result=>{
  console.log(result);
  const newData=data.map(item=>{
    if(item._id===result._id){
      return result
    }else{
      return item
    }
  })
  setData(newData)
}).catch(err=>{
  console.log(err);
})
  }

  const deletePost=(postId)=>{
fetch(`/deletepost/${postId}`,{
  method:"delete",
  headers:{
    "authorization":"Bearer "+localStorage.getItem("jwt")
  }
}).then(res=>res.json())
.then(result=>{
  console.log(result);
const newData=data.filter(item=>{
  return result._id!==item._id
})
setData(newData)
})
  }

    return (
      
        <div className="home">
        {!data?console.log("no data"):data.map(item=>{
          return (
            <div className="card home-card" key={item._id}>
         <h5 style={{paddingLeft:"15px"}}><Link to={item.postedBy._id!==state._id?`/profile/${item.postedBy._id}`:"/profile"}>{item.postedBy.name}</Link>
         {item.postedBy._id===state._id&&
          <i className="material-icons"style={{float:"right",cursor:"pointer"}} onClick={()=>deletePost(item._id)}>delete</i>}
        
         </h5>
         
         <div className="card-img">
           <img
           style={{height:"300px",width:"100%",objectFit:"cover"}} src={item.photo}  />
         </div>
         <div className="card-content">
         <i className="material-icons" style={{color:"red"}}>favorite</i>
         {item.likes.includes(state._id)?
          <i className="material-icons" style={{cursor:"pointer"}}
          onClick={()=>{unlikePost(item._id)}}>thumb_down</i> 
         :
          <i className="material-icons" style={{cursor:"pointer"}}
         onClick={()=>{likePost(item._id)}}>thumb_up</i>
         }
        
         
  <h6>{item.title}</h6>
         <h6>{item.likes.length} likes</h6>
           <p>{item.body}</p>
           {item.comments.map(record=>{
           return (
             <h6><span style={{fontWeight:"500"}}>{record.postedBy.name}:</span>{record.text}</h6>
           )  
           })}
           <form onSubmit={(e)=>{
e.preventDefault()
//console.log(e.target[0].value)
makeComment(e.target[0].value,item._id)
e.target[0].value=""
           }}>
           <input type="text" placeholder="add a comment"/>
  </form>
         </div>
</div>
          )
        })}
        

        
        </div>
    )
}

export default Home
