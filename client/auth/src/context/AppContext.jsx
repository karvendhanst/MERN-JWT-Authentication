import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider = (props)=>{

    const backendUrl  = import.meta.env.VITE_BACKED_URL

    const [isLoggedin, setIsLoggedIn] = useState(false)

    const [userData, setuserData] = useState(false)

    const getAuthState = async()=>{
      
            const userData = await axios.get(backendUrl+"/api/auth/is-auth", { withCredentials: true })
          
            if(userData.data.success){ 
                setIsLoggedIn(true)
                getUserData()
            }    
    }

    const getUserData = async()=>{   
            try {
                const userData = await axios.get(backendUrl+"/api/user/data", { withCredentials: true })
              
                userData.data.success ? setuserData(userData.data.user) : toast.error(userData.data.msg)
            } catch (error) {
                toast.error(error.message)
            }
    }

    const value = {backendUrl, isLoggedin, setIsLoggedIn, userData, setuserData, getUserData}

    useEffect(()=>{
        getAuthState()
    },[])
    
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider

