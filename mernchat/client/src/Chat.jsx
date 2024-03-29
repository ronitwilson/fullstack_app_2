import React, { useState } from "react"
import { useEffect } from "react"
import  Avatar from "./Avatar"
import { UserContext } from './UserContext'
import { useContext } from 'react'
import {uniqBy} from 'lodash'


export default function Chat() {
    const [ws, setWs] = useState(null)
    const [people, setPeople] = useState({})
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [message, setMessage] = useState('')
    const [sentMessages, setSentMessages] = useState([])
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
            console.log({ev, messageData})
            if ('online' in messageData) {
                showOnlinePeople(messageData.online)
            }
            else if('text' in messageData){
                setSentMessages(prev => [...prev, {text: messageData.text, is_our: false, id: messageData.id}])
            }
        }
        
    }, [])

    function sendMessage(ev) {
        ev.preventDefault()
        console.log(" !!message is " ,message)
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: message
        }))
        setMessage('')
        setSentMessages(prev => [...prev, {text: message, is_our: true}])
    }
    const otherOnlinePeople = {...people};
    // console.log("otherOnlinePeople are ", otherOnlinePeople)
    delete otherOnlinePeople[id];

    const removeDuplicateMessages  =  uniqBy(sentMessages, 'id')
    return(
        <div className="flex h-screen">
            <div className="bg-blue-80 w-1/3">
                <div className="text-blue-600 font-bold">MernChat</div>
                {
                Object.keys(otherOnlinePeople).map(userId => (
                    <div onClick={() => setSelectedUserId(userId)} key={userId} className={"border-b border-gray-100 flex items-center gap-2 " + (userId === selectedUserId ? 'bg-blue-100': '')}>
                        {userId === selectedUserId && (
                            <div className="bg-blue-500 w-1 h-12 "></div>
                        )}
                        <div className="flex gap-2 py-2 pl-4 items-center ">
                        <Avatar username={people[userId]} userId={userId}/>
                        <span>{people[userId]}</span>
                        </div>
                        </div>
                ))
                }
            </div>
            <div className="flex flex-col bg-blue-200 w-2/3">
                <div className="flex-grow p-2"> {selectedUserId &&<span>messages with {people[selectedUserId]}</span> } 
                {!selectedUserId && (
                    <div className="text-center text-gray-500">Select a person to chat with</div>
                )}
                {!! selectedUserId &&(
                    <div>
                        {
                            removeDuplicateMessages.map((messages,index) => (
                                
                                <div key={index}>{messages.text}</div>
                            ))
                        }
                    </div>
                )}
            </div>
                {!! selectedUserId && (
                    <form className="flex gap-2 p-2 "  onSubmit={sendMessage}>
                    <input type="text" 
                    onChange={ev => {setMessage(ev.target.value)}}
                    placeholder="type a message" 
                    className="bg-white border p-2 flex-grow rounded-sm" />
                    <button type="submit" className="bg-blue-500 p-2 m-2 text-white rounded-sm">Send</button>
                </form>  
                )}
            </div>
        </div>
    )
}