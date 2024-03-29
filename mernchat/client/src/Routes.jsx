import RegitsterAndLoginForm from './RegitsterAndLoginForm'
import Chat from './Chat.jsx'
import { UserContext } from './UserContext'
import { useContext } from 'react'

function Routes() {
    const {username, id} = useContext(UserContext)
    // console.log(" debug !! username is ", username)
    // console.log(" debug !! id is ", id)
    if (username) {
        // return 'logged in as ' + username + ' with id ' + id 
        return <Chat />
    }
    return (
        <RegitsterAndLoginForm />
    );
}

export default Routes