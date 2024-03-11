export default function Chat() {
    return(
        <div className="flex h-screen">
            <div className="bg-blue-80 w-1/3">People</div>
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