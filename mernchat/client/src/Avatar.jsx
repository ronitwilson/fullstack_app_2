export default function Avatar({username, userId}) {
    const colors = ['bg-green-200', 'bg-red-200', 'bg-yellow-200', 'bg-blue-200', 'bg-teal-200']
    const userIdBase10 = parseInt(userId, 16)
    console.log("userIdBase10 is ", userIdBase10)
    const colorIndex = userIdBase10 % colors.length
    const color = colors[colorIndex]
    console.log("color is ", color)
    return (<div className={"w-8 h-8 rounded-full items-center " +color}>
        <div className="text-center w-full opacity-70">{username[0]}</div>
    </div>);
}
