export default function Register() {
    return(
        <div className="bg-blue-50 h-screen flex items-center" >
            <form className="w-64 mx-auto">
            <input type="text" placeholder="Username" className="block w-full p-2 m-2 border" />
            <input type="password" placeholder="Password" className="block w-full p-2 m-2 border"/>
            <button className="bg-blue-500 text-white block w-full p-2 m-2 ">Register</button>
            </form>
        </div>
    )
}