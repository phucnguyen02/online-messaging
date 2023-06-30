import React, {useState, useEffect, useRef} from 'react'
import '../styles/Chat.css'
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';

function Messages({socket, username}) {
    const [messagesReceived, setMessagesReceived] = useState([]);
    const [editing, setEditing] = useState(false);
    const [editID, setEditID] = useState(-1);
    const [editMsg, setEditMsg] = useState('');

    const messagesColumnRef = useRef(null);

    function handleMessageChange({target}){
        setEditMsg(target.value);
    }

    function handleKeyDown(event){
        if(event.key === 'Enter' && editMsg !== ''){
            setEditing(false);
            socket.emit('edit_message', {editID, editMsg});
            setEditMsg('');
        }
    }

    useEffect(() => {
        socket.on('receive_message', (data) => {
            console.log(data);
            setMessagesReceived((state) => [
                ...state,
                {
                  message: data.message,
                  username: data.username,
                  __createdTime__: data.__createdTime__,
                }
              ]);
        });

        return () => socket.off('receive_message');
    }, [socket])

    useEffect(() => {
        socket.on('last_100_messages', (last100Messages) => {
            console.log('Last 100 messages: ', last100Messages);
            last100Messages = last100Messages.map((msg) => {
                return {
                    id: msg.messageID,
                    username: msg.sender,
                    message: msg.content,
                    __createdTime__: msg.updatedAt
                }
            })
            setMessagesReceived((state) => [...last100Messages]);
        })

        return () => socket.off('last_100_messages');
    }, [socket]);

    useEffect(() => {
        messagesColumnRef.current.scrollTop = messagesColumnRef.current.scrollHeight;
    }, [messagesReceived]);


    function formatDateFromTimestamp(timestamp){
        const date = new Date(timestamp);
        return date.toLocaleString();
    }


    return (
        <div className='messagesColumn' ref = {messagesColumnRef}>
            {messagesReceived.map((msg, i) => (
                <div className='message' key = {i}>
                    <div style = {{
                        display: `${(editing && msg.id === editID)? 'none' : 'block'}`
                    }}>
                        <div style = {{display: 'flex', justifyContent: 'space-between'}}>
                            <span className='msgMeta'>{msg.username}</span>
                            <span className='msgMeta'>
                                {formatDateFromTimestamp(msg.__createdTime__)}
                            </span>
                        </div>
                        
                        <p className='msgText'>{msg.message}</p>
                    </div>

                    <input className='messageInput' placeholder = 'Message...' onChange={handleMessageChange} value = {editMsg}
                    onKeyDown = {handleKeyDown} style = {{
                        display: `${(editing && msg.id === editID)? 'block' : 'none'}`
                        }} />

                    <div style = {{display: 'flex'}}>
                        <div onClick = {() => {
                                if(!editing){
                                    setEditing(true);
                                    setEditID(msg.id);
                                }
                                else{
                                    setEditing(false);
                                }
                            }} 
                            value = {msg.id} 
                            style = {{
                                    display: `${msg.username === username ? 'block' : 'none'}`
                                }}>
                            <ModeEditIcon/>
                        </div>

                        <div onClick = {() => {
                                socket.emit('delete_message', {id: msg.id});
                            }} 
                            style = {{
                                    display: `${msg.username === username ? 'block' : 'none'}`
                            }}>
                            <DeleteIcon/>
                        </div>
                    </div>
                    <br/>
                </div>
            ))}
        </div>
    )
}

export default Messages;