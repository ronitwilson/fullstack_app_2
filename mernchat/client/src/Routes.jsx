import Register from './Register'
import { UserContext } from './UserContext'
import { useContext } from 'react'

function Routes() {
    const {username, id} = useContext(UserContext)
    if (username) {
        return 'logged in';
    }
    return (
        <Register />
    );
}

export default Routes