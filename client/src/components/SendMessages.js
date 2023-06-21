import React, {useState} from 'react'
import '../styles/Chat.css'

function SendMessages({socket, username}) {
    const [message, setMessage] = useState('');

    function sendMessage(){
        if(message !== ''){
            const __createdTime__ = Date.now();
            socket.emit('send_message', {username, message, __createdTime__});
            setMessage('');
        }
    }

    function handleMessageChange({target}){
        setMessage(target.value);
    }

    function handleKeyDown(event){
        if(event.key === 'Enter')
            sendMessage();
    }

    return (
        <div className = 'sendMessageContainer'>
            <input className='messageInput' placeholder = 'Message...' onChange={handleMessageChange} value = {message}
            onKeyDown = {handleKeyDown}/>
            <button className='btn btn-primary' onClick={sendMessage}>
                Send
            </button>
        </div>
    )
}

export default SendMessages