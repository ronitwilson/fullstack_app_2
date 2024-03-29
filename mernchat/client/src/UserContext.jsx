import axios from 'axios';
import { createContext, useEffect, useState } from 'react'

export const UserContext = createContext({});

// eslint-disable-next-line react/prop-types
export function UserContextProvider({children}) {
    const [username, setUsername] = useState(null)
    const [id  , setId] = useState(null)  
    useEffect(() => {
        console.log("fetching profile")
        axios.get('/profile').then(response => {
            console.log("username is ", response.data)
            console.log("username is ", response.data.decoded.username)
            setId(response.data.decoded.userId)
            setUsername(response.data.decoded.username)
        });
    }, [])
    return (
        <UserContext.Provider value={{username, setUsername, id, setId}}>
            {children}
        </UserContext.Provider>
    )
}