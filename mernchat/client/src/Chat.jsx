import React, { useState, useRef } from "react"
import { useEffect } from "react"
import Contact from "./Contact"
import { UserContext } from './UserContext'
import { useContext } from 'react'
import {set, uniqBy} from 'lodash'
import axios from 'axios'                              


export default function Chat() {
    const [ws, setWs] = useState(null)
    const [people, setPeople] = useState({})
    const [offlinePeople, setOfflinePeople] = useState({})
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [message, setMessage] = useState('')
    const [sentMessages, setSentMessages] = useState([])
    const {username, setUsername, id, setId} = useContext(UserContext)
    const divUnderMessages = useRef();

    useEffect(() => {
        connectToWs()
        }, []);

    function connectToWs() {
        const ws = new WebSocket("ws://localhost:3000")
        setWs(ws)
        ws.addEventListener('message',handleWsMessage)
        ws.addEventListener('close', connectToWs)
    }

    useEffect(() => {
        axios.get('/userList').then(response => {
            // console.log("offline people are ", response.data)
            const peopleList = response.data
            const offlinePoepleArr = peopleList
                .filter(user => user._id !== id)
                .filter(user => Object.keys(people).indexOf(user._id) === -1)
            // console.log("offline people are ", offlinePoepleArr)
            const offlinePeople = {}
            offlinePoepleArr.forEach(user => {
                offlinePeople[user._id] = user.username
            })
            setOfflinePeople(offlinePeople)
            console.log("offline people are ", offlinePeople)
        })
    }, [people]);


    function logout() {
        axios.post('/logout').then(response => {
            // ws.close()
            setWs(null)
            setUsername(null)
            setId(null)
            console.log("response is ", response.data)})
        }

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
        // getOfflinePeople()
    }

    function handleWsMessage(ev) {
        const messageData = JSON.parse(ev.data)
        console.log({ev, messageData})
        if ('online' in messageData) {
            showOnlinePeople(messageData.online)
        }
        else if('text' in messageData){
            setSentMessages(prev => [...prev, {text: messageData.text, is_our: false, id: messageData.id, sender: messageData.sender, recipient:  id}])
        }
    }
        
    function sendMessage(ev, file = null) {
        if(ev) {
            ev.preventDefault()
        }
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: message,
            file
        }))
        setSentMessages(prev => [...prev, {text: message, is_our: true, id: Math.random(), sender: id, recipient: selectedUserId}])
        setMessage('')
    }


    function sendFile(ev) {
        // console.log("file is ", ev.target.files[0])
        const reader = new FileReader()
        reader.readAsDataURL(ev.target.files[0])
        reader.onload = () => {
            sendMessage(null, {
                name: ev.target.files[0].name,
                data: reader.result
            })
        }
    }

    useEffect(( ) => {        
            const div = divUnderMessages.current;
            if (div) {
                div.scrollIntoView({behavior: 'smooth'})
            }
        }, [sentMessages])

    useEffect(( ) => {        
        if (selectedUserId) {
            const url = '/messages/' + selectedUserId
             axios.get(url).then(response => {
                console.log("response is ", response.data)
            // setSentMessages(response.data)
            const formatedMessages = response.data.map(message => {
            let newObj = {...message, id: message._id}
            delete newObj._id
            return newObj
            })  
            setSentMessages(prev => [...prev, ...formatedMessages])
            })
        }
    }, [selectedUserId])

    
    const otherOnlinePeople = {...people};
    // console.log("otherOnlinePeople are ", otherOnlinePeople)
    delete otherOnlinePeople[id];

    const removeDuplicateMessages  =  uniqBy(sentMessages, 'id')
    return(
        <div className="flex h-screen">
            <div className="bg-blue-80 w-1/3 flex flex-col">
                <div className="flex-grow">
                <div className="text-blue-600 font-bold">MernChat</div>
                {
                Object.keys(otherOnlinePeople).map(userId => (
                    <Contact id={userId}
                     username={otherOnlinePeople[userId]} 
                     onClick={()=> setSelectedUserId(userId)}
                     selectedUserId={selectedUserId}
                     online={true}
                     key={userId}/>
                ))}{
                Object.keys(offlinePeople).map(userId => (
                    <Contact id={userId}
                     username={offlinePeople[userId]} 
                     onClick={()=> setSelectedUserId(userId)}
                     selectedUserId={selectedUserId}
                     online={false}
                     key={userId}/>
                ))
                }
                </div>
            <div className="p-2 text-center">
                <span className="text-gray-500 m-2 ">Logged in as {username}</span>
                <button onClick={logout} className="bg-blue-500 text-white p-2 rounded-sm">Logout</button>
            </div> 

            </div>
            <div className="flex flex-col bg-blue-200 w-2/3">
                <div className="flex-grow p-2"> 
                {!selectedUserId && (
                    <div className="text-center text-gray-500">Select a person to chat with</div>
                )}
                {!! selectedUserId &&(
                    <div className="relative h-full mb-4">
                        <div className="overflow-y-scroll absolute inset-0">
                            {
                                removeDuplicateMessages.map((messages,index) => (
                                    <div key={index} className={messages.sender === id ? 'text-right': 'text-left'}>
                                        <div key={index} className={"inline-block p-2 my-2 rounded-md text-sm "+ (messages.sender === id ? 'bg-blue-500 text-white': 'bg-white text-gray-500')}>
                                            {messages.text}
                                        </div>
                                    </div>
                                ))
                            }
                            <div ref={divUnderMessages}></div>
                        </div>
                    </div>

                )}
            </div>
                {!! selectedUserId && (
                    <form className="flex gap-2 p-2 "  onSubmit={sendMessage}>
                    <input type="text" 
                    onChange={ev => {setMessage(ev.target.value)}}
                    placeholder="type a message" 
                    className="bg-white border p-2 flex-grow rounded-sm" />
                    <label type="button" className="bg-blue-500 p-2 m-2 cursor-pointer text-white rounded-sm">
                    <input type="file" className="hidden" onChange={sendFile}/>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                    </svg>
                    </label>
                    <button type="submit" className="bg-blue-500 p-2 m-2 text-white rounded-sm">Send</button>
                </form>  
                )}
            </div>
        </div>
    )
}