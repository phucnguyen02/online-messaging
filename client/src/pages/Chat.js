import React from 'react'
import Messages from '../components/Messages';
import SendMessages from '../components/SendMessages';
import UsersList from '../components/UsersList';
import '../styles/Chat.css';

function Chat({socket, username}) {
  console.log(username);
  return (
    <div className='chatContainer'>

      <UsersList socket = {socket} username = {username}/>
      <div>
          <Messages socket = {socket} username = {username}/>
          <SendMessages socket = {socket} username = {username}/>
      </div>
    </div>
  )
}

export default Chat