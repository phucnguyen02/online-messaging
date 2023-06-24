import React, {useState} from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Signup() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = Navigate();

    function handleUsernameChange({target}){
        setUsername(target.value);
    }

    function handlePasswordChange({target}){
        setPassword(target.value);
    }

    function handleSignup(){
        
        navigate('/', {replace: true})
    }

    return (
        <div className='container'>
        <div className='formContainer'>
            <input className='input' placeholder='Username' onChange = {handleUsernameChange} value = {username} />
            <input className='input' placeholder='Password' onChange = {handlePasswordChange} value = {password}/>
            <button className='btn btn-secondary' style={{ width: '100%' }} onClick = {joinRoom}>Signup</button>
        </div>
        </div>
    )
}

export default Signup