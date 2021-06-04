import React,{useEffect,createContext,useReducer,useContext} from "react"
import Navbar from "./componenets/NavbaComp"
import "./app.css"
import {BrowserRouter,Route,Switch,useHistory,useLocation} from "react-router-dom"
import Home from "./screens/Home"
import Signup from "./screens/Signup"
import Profile from "./screens/Profile"
import Login from "./screens/Login"
import CreatePost from "./screens/CreatePost"
import {reducer,initialState} from "./reducers/userReducer"
import UserProfile from "./screens/UserProfile"
import SubscribedUserPosts from "./screens/subscribedUserPosts" 

export const UserContext=createContext()
const Routing=()=>{
  const history=useHistory()
  const {state,dispatch}=useContext(UserContext)
  const location = useLocation();

useEffect(()=>{
const user=JSON.parse(localStorage.getItem("user"))
if(user){
  dispatch({type:"USER",payload:user})
  history.push(location.pathname)
 
}else{
  history.push("/login")
}
},[history,dispatch])

  return (
    <Switch>
<Route path="/" exact><Home /></Route>
<Route path="/signup"><Signup /></Route>
<Route path="/login"><Login /></Route>
<Route exact path="/profile"><Profile /></Route>
<Route path="/create"><CreatePost /></Route>
<Route path="/profile/:userid"><UserProfile /></Route>
<Route path="/myfollowingpost"><SubscribedUserPosts /></Route>
</Switch>  )
}

function App() {
const [state,dispatch]=useReducer(reducer,initialState)
return (
  <UserContext.Provider value={{state,dispatch}}>
<BrowserRouter>
<Navbar />
<Routing />

</BrowserRouter>  

  </UserContext.Provider>
  
 
)


}
    


export default App;
