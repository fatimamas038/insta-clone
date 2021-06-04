import React,{useContext,useRef,useEffect,useState} from 'react'
import {Link,useHistory} from "react-router-dom"
import {UserContext} from "../App"
import M from "materialize-css"


const NavbarComp = () => {
  const searchModal=useRef(null)
  const navModal=useRef(null)
  const [search,setSearch]=useState("")
  const [userdetails,setUserdetails]=useState([])
  const history=useHistory()
  const {state,dispatch}=useContext(UserContext)
  


useEffect(()=>{
M.Modal.init(searchModal.current)
M.Sidenav.init(navModal.current)
},[])

const fetchUsers=(query)=>{
setSearch(query)
fetch("/search",{
  method:"post",
  headers:{
      "Content-Type":"application/json"
  },
  body:JSON.stringify({
      query
  })
})
.then(res=>res.json())
.then(result=>{
  console.log(result);
  setUserdetails(result.user)
})
.catch(err=>{
  console.log(err);
})
}

    return (
      <>
      <nav className="nav-extended">
    <div className="nav-wrapper white">
      <Link to={state?"/":"/login"} className="brand-logo">Instagram</Link>
      <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
      <ul id="nav-mobile" className="right hide-on-med-and-down" >
        {state?<>
          <li key="2"><i data-target="modal1" className="material-icons modal-trigger" style={{color:"black",cursor:"pointer"}}>search</i></li>
<li key="1"><Link to="/profile">Profile</Link></li>
<li key="3"><Link to="/create">Create post</Link></li>
        <li key="4"><Link to="/myfollowingpost">friend's posts</Link></li>

        <li key="5">
          <button className="btn"
          onClick={()=>{
            localStorage.clear()
            dispatch({type:"CLEAR"})
            history.push("/login")
          }}>Logout

          </button>
        </li>
        </>:<>
        <li key="6"><Link to="/login">Login</Link></li>
        <li key="7"><Link to="/signup">Signup</Link></li>
        </>}
        
      </ul>
    </div>
    <div id="modal1" className="modal" ref={searchModal} >
    <div className="modal-content" style={{color:"black"}}>
    <input
          type="text"
        placeholder="search user"
          value={search}
          onChange={(e)=>fetchUsers(e.target.value)}
          />
        
        <div className="collection">
        <ul className="collection">
{userdetails&&userdetails.map(item=>{
  return <li className="collection-item"><Link to={item._id!==state._id?`/profile/${item._id}`:"/profile"}
  onClick={()=>{
    M.Modal.getInstance(searchModal.current).close()
    setSearch("")
  }}>{item.email}</Link></li>
})}

    </ul>
      </div>

    </div>
    <div className="modal-footer">
      <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>{setSearch("")}}>close</button>
    </div>
  </div>
  </nav>
  <ul className="sidenav" id="mobile-demo" ref={navModal}>
     {state?
     <><li key="2"><i data-target="modal1" className="material-icons modal-trigger" style={{color:"black",cursor:"pointer",marginLeft:"30px"}}>search</i></li>
        <li key="1"><Link to="/profile">Profile</Link></li>
        <li key="3"><Link to="/create">Create post</Link></li>
                <li key="4"><Link to="/myfollowingpost">friend's posts</Link></li>
        
                <li key="5">
                  <button className="btn"
                  onClick={()=>{
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    history.push("/login")
                  }}>Logout
        
                  </button>
                </li></>:<>
                <li key="6"><Link to="/login">Login</Link></li>,
        <li key="7"><Link to="/signup">Signup</Link></li></>}  
                
                </ul>
    </>
    )
}

export default NavbarComp
