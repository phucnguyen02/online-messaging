import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import axios from 'axios';
import Cookies from "universal-cookie";
const cookies = new Cookies();

function Home({username, setUsername, socket}) {
    const navigate = useNavigate();
    const [password, setPassword] = useState('')
    
    function handleUsernameChange({target}){
        setUsername(target.value);
    }

    function handlePasswordChange({target}){
        setPassword(target.value);
    }

    function handleSignup(){
        navigate('/signup', {replace: true})
    }

    useEffect(() => {
        localStorage.setItem("username", JSON.stringify(username));
    }, [username])


    function handleLogin(){
        const configuration = {
            method: "post",
            url: "https://phuc-chatroom-app.onrender.com/login",
            data: {
              username,
              password,
            }
        };
        axios(configuration).then((res) => {
            cookies.set("TOKEN", res.data.token, {
                path: "/",
            });      
            socket.emit('join_room', {username});
            navigate('/chat', {replace: true})
        }).catch((err) => {
            alert('Invalid credentials!');
        });
    }

    return (
        <div className='container'>
            <div className='formContainer'>
                <input className='input' placeholder='Username' onChange = {handleUsernameChange} />
                <input className='input' placeholder='Password' onChange = {handlePasswordChange} value = {password} type = "password"/>
                <button className='btn btn-secondary' style={{ width: '100%' }} onClick = {handleSignup}>Register</button>
                <button className='btn btn-secondary' style={{ width: '100%' }} onClick = {handleLogin}>Login</button>
            </div>
        </div>
    )
}

export default Home