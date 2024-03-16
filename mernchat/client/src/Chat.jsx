import React, { useState } from "react"
import { useEffect } from "react"
import  Avatar from "./Avatar"

export default function Chat() {
    const [ws, setWs] = useState(null)
    const [people, setPeople] = useState({})
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:3000")
        setWs(ws)

        ws.addEventListener('message',handleWsMessage)
        
        function showOnlinePeople(peopleArray) {
            const people = {}
            if (!peopleArray) {
                return
            }
            peopleArray.forEach(({userId, username}) => {
                people[userId] = username
            });
            console.log("people are ", people)
            setPeople(people)
        }

        function handleWsMessage(ev) {
            const messageData = JSON.parse(ev.data)
            console.log("messageData is ", messageData)
            if ('online' in messageData) {
                showOnlinePeople(messageData.online)
            }
        }
    }, [])
    return(
        <div className="flex h-screen">
            <div className="bg-blue-80 w-1/3">
                <div className="text-blue-600 font-bold">MernChat</div>
                {Object.keys(people).map(userId => (
                    <div key={userId} className="border-b border-gray-100 py-2 flex items-center gap-2">
                        <Avatar username={people[userId]} userId={userId}/>
                        <span>{people[userId]}</span>
                        </div>
                ))
                    }
            </div>
            <div className="flex flex-col bg-blue-200 w-2/3">
                <div className="flex-grow p-2"> messages with selected person</div>
                <div className="flex gap-2 p-2">
                    <input type="text" placeholder="type a message" className="bg-white border p-2 flex-grow rounded-sm" />
                    <button className="bg-blue-500 p-2 m-2 text-white rounded-sm">Send</button>
                </div>
            </div>
        </div>
    )
}