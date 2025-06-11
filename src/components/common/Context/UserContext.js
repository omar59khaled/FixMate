import { createContext, useState } from "react";

export let userContext = createContext()
export default function UserContextProvider(props){


const [token, setToken] = useState(null)
return <userContext.Provider value={{token , setToken}}>
    {props.children}
</userContext.Provider>


}