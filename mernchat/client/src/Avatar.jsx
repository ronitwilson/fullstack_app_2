export default function Avatar({username, userId, online}) {
    const colors = ['bg-green-200', 'bg-red-200', 'bg-yellow-200', 'bg-blue-200', 'bg-teal-200']
    const userIdBase10 = parseInt(userId, 16)
    const colorIndex = userIdBase10 % colors.length
    const color = colors[colorIndex]
    return (userId && <div className={"w-8 h-8 relative rounded-full items-center " +color}>
        <div className="text-center w-full opacity-70">{username[0]}</div>
        { online && (<div className="absolute w-2 h-2 bg-green-400 bottom-0 right-0 rounded-full"></div>)}
        { ! online && (<div className="absolute w-2 h-2 bg-yellow-900 bottom-0 right-0 rounded-full"></div>)}
    </div>);
}
