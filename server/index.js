const express = require('express');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const db = require('./models');
const {insertMessage, getLatest100Messages, editMessage, deleteMessage} = require('./controllers/messagesController');

const CHAT_BOT = 'ChatBot';
let users = [];
const app = express();
app.use(cors());
const server = http.createServer(app);
const leaveRoom = require('./utils/leave-room');

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on('join_room', (data) => {
        const {username} = data;
        const room = "main";
        socket.join(room);

        let __createdTime__ = Date.now()

        socket.to(room).emit('receive_message', {
            message: `${username} has joined the chat room`,
            username: CHAT_BOT,
            __createdTime__
        })

        socket.emit('receive_message', {
            message: `Welcome ${username}`,
            username: CHAT_BOT,
            __createdTime__
        })
        users.push({id: socket.id, username});
        socket.to(room).emit('chatroom_users', users);
        socket.emit('chatroom_users', users);
        socket.on('send_message', (data) => {
            const {username, message, __createdTime__} = data;
            io.in(room).emit('receive_message', data);
            insertMessage(username, message);
        })

        getLatest100Messages().then((last100Messages) => {
            socket.emit('last_100_messages', last100Messages);
        });

        socket.on('edit_message', (data) => {
            const {editID, editMsg} = data;
            editMessage(editID, editMsg);
        })

        socket.on('delete_message', (data) => {
            const {id} = data;
            deleteMessage(id);
        })

        socket.on('leave_room', (data) => {
            const {username} = data;
            socket.leave(room);
            const __createdTime__ = Date.now();
            users = leaveRoom(socket.id, users);
            socket.to(room).emit('chatroom_users', users);
            socket.to(room).emit('receive_message', {
                username: CHAT_BOT,
                message: `${username} has left the chat`,
                __createdTime__
            })
            console.log(`${username} has left the chat`);
        })

        socket.on('disconnect', () => {
            console.log('A user has disconnected from the chat');
            const user = users.find((user) => user.id === socket.id);
            if(user?.username){
                users = leaveRoom(socket.id, users);
                socket.to(room).emit('chatroom_users', users);
                socket.to(room).emit('receive_message', {
                    username: CHAT_BOT,
                    message: `${username} has left the chat`,
                    __createdTime__
                })
                console.log(`${username} has left the chat`);
            }
        })


    })
})

db.sequelize.sync().then((req) => {
    server.listen(4000, () => 'Server is running on port 4000')
})