import React, { useState } from "react"
import { useEffect } from "react"
import  Avatar from "./Avatar"
import { UserContext } from './UserContext'
import { useContext } from 'react'

export default function Chat() {
    const [ws, setWs] = useState(null)
    const [people, setPeople] = useState({})
    const [selectedUserId, setSelectedUserId] = useState(null)
    const {username, id} = useContext(UserContext)

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

    const otherOnlinePeople = {...people};
    console.log("otherOnlinePeople are ", otherOnlinePeople)
    delete otherOnlinePeople[id];
    return(
        <div className="flex h-screen">
            <div className="bg-blue-80 w-1/3">
                <div className="text-blue-600 font-bold">MernChat</div>
                {
                Object.keys(otherOnlinePeople).map(userId => (
                    <div onClick={() => setSelectedUserId(userId)} key={userId} className={"border-b border-gray-100 py-2 pl-4 flex items-center gap-2 " + (userId === selectedUserId ? 'bg-blue-100': '')}>
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