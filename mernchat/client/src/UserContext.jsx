import { createContext, useState } from 'react'

export const UserContext = createContext({});

// eslint-disable-next-line react/prop-types
export function UserContextProvider({children}) {
    const [username, setUsername] = useState(null)
    const [id  , setId] = useState(null)  
    return (
        <UserContext.Provider value={{username, setUsername, id, setId}}>
            {children}
        </UserContext.Provider>
    )
}