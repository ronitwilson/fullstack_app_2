import axios from 'axios'
import { useState } from 'react'

export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    async function  register(ev) {
        ev.preventDefault()
        console.log("registering with details")
        const response = await axios.post('/register', {username, password})
        console.log("response", response)
    }

    return(
        <div className="bg-blue-50 h-screen flex items-center" >
            <form className="w-64 mx-auto mb-12" onSubmit={register}>
            <input type="text" placeholder="Username" 
                value={username}
                onChange={ev => setUsername(ev.target.value)} 
                className="block w-full p-2 m-2 border" />
            <input type="password" 
                placeholder="Password" value={password} 
                onChange={ev => setPassword(ev.target.value)}
                 className="block w-full p-2 m-2 border"/>
            <button className="bg-blue-500 text-white block w-full p-2 m-2 ">Register</button>
            </form>
        </div>
    )
}