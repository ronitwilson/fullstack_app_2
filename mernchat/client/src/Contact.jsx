import Avatar from "./Avatar"

export default function Contact({id, username, onClick, selectedUserId, online}) {
   return (
    <div onClick={() => onClick(id)} key={id} className={"border-b border-gray-100 flex items-center gap-2 " + (id === selectedUserId ? 'bg-blue-100': '')}>
                        {id === selectedUserId && (
                            <div className="bg-blue-500 w-1 h-12 "></div>
                        )}
                        <div className="flex gap-2 py-2 pl-4 items-center ">
                        <Avatar username={username} userId={id} online={online}/>
                        <span>{username}</span>
                        </div>
                        </div>
   ) 
}
