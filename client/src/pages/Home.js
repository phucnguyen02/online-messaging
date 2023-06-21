import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';


function Home({username, setUsername, socket}) {
    const navigate = useNavigate();
    
    function handleUsernameChange({target}){
        setUsername(target.value);
    }

    function joinRoom(){
        if(username !== ''){
            socket.emit('join_room', {username});
        }

        navigate('/chat', {replace: true})
    }

    return (
        <div className='container'>
        <div className='formContainer'>
            <input className='input' placeholder='Username' onChange = {handleUsernameChange} />

            <button className='btn btn-secondary' style={{ width: '100%' }} onClick = {joinRoom}>Join Room</button>
        </div>
        </div>
    )
}

export default Home