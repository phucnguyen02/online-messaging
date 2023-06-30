import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Chat.css'

function UsersList({socket, username}) {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        socket.on('chatroom_users', (data) => {
            console.log(data);
            setUsers(data);
        })
        console.log(username);
        return () => socket.off('chatroom_users');
    }, [socket]);

    const leaveRoom = () => {
        const __createdTime__ = Date.now();
        socket.emit('leave_room', {username, __createdTime__});
        navigate('/', {replace: true});
    }

    return (
        <div className='roomAndUsersColumn'>
            <div>
                {users.length > 0 && <h5 className='usersTitle'>Users:</h5>}
                <ul className='usersList'>
                    {users.map((user) => (
                        <li
                        style={{
                            fontWeight: `${user.username === username ? 'bold' : 'normal'}`,
                        }}
                        key={user.id}
                        >
                        {user.username}
                        </li>
                    ))}
                </ul>
            </div>

            <button className='btn btn-outline' onClick ={leaveRoom}>
                Leave
            </button>
        </div>
    )
}

export default UsersList