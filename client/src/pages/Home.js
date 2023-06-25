import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import axios from 'axios';


function Home({username, setUsername, socket}) {
    const navigate = useNavigate();
    const [password, setPassword] = useState('')
    
    function handleUsernameChange({target}){
        setUsername(target.value);
    }

    function handlePasswordChange({target}){
        setPassword(target.value);
    }

    function joinRoom(){
        if(username !== ''){
            socket.emit('join_room', {username});
        }

        navigate('/chat', {replace: true})
    }

    function handleSignup(){
        navigate('/signup', {replace: true})
    }

    return (
        <div className='container'>
            <div className='formContainer'>
                <input className='input' placeholder='Username' onChange = {handleUsernameChange} />
                <input className='input' placeholder='Password' onChange = {handlePasswordChange} value = {password} type = "password"/>
                <button className='btn btn-secondary' style={{ width: '100%' }} onClick = {handleSignup}>Register</button>
                <button className='btn btn-secondary' style={{ width: '100%' }} onClick = {joinRoom}>Login</button>
            </div>
        </div>
    )
}

export default Home