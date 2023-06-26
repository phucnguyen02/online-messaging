import React, {useState} from 'react'
import '../styles/Home.css';
import axios from 'axios';

function Signup() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [register, setRegister] = useState(false);

    function handleUsernameChange({target}){
        setUsername(target.value);
    }

    function handlePasswordChange({target}){
        setPassword(target.value);
    }

    function handleSubmit(){
        const configuration = {
            method: "post",
            url: "https://phuc-chatroom-app.onrender.com/register",
            data: {
              username,
              password,
            }
        };
        axios(configuration).then((res) => {
            if(res.status === 500)
                alert('Username is already registered!');
            else
                setRegister(true);
        }).catch((err) => {
            err = new Error();
        });
    }

    return (
        <div className='container'>
        <div className='formContainer'>
            <input className='input' placeholder='Username' onChange = {handleUsernameChange} value = {username} />
            <input className='input' placeholder='Password' onChange = {handlePasswordChange} value = {password} type = "password" />
            <button className='btn btn-secondary' style={{ width: '100%' }} onClick = {handleSubmit}>Submit</button>
            {register ? (
                <p>You Are Registered Successfully</p>
                ) : (
                <p>You Are Not Registered</p>
                )
            }
        </div>
        </div>
    )
}

export default Signup