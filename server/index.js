const express = require('express');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const db = require('./models');
const {insertMessage, getLatest100Messages, editMessage, deleteMessage} = require('./controllers/messagesController');
const routes = require('./routes/userRoutes')

const CHAT_BOT = 'ChatBot';
let users = [];
const app = express();
app.use(cors());
app.use(express.json()); // Parse request bodies as JSON
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.use(routes);

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

app.get("/", (request, response, next) => {
    response.json({ message: "Hey! This is your server response!" });
    next();
  });

const server = http.createServer(app);
const leaveRoom = require('./utils/leave-room');

const io = new Server(server, {
    cors: {
        origin: 'https://master--willowy-fenglisu-cbfdb9.netlify.app',
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
            editMessage(editID, editMsg).then((res) => {
                getLatest100Messages().then((last100Messages) => {
                    socket.emit('last_100_messages', last100Messages);
                });
            });
        })

        socket.on('delete_message', (data) => {
            const {id} = data;
            deleteMessage(id).then((res) => {
                getLatest100Messages().then((last100Messages) => {
                    socket.emit('last_100_messages', last100Messages);
                });
            });
            
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

// db.sequelize.sync({ alter: true, logging: true }).then((req) => {
//     server.listen(4000, () => 'Server is running on port 4000')
// }).catch((err) => {
//     console.log(err);
// })

server.listen(4000, () => 'Server is running on port 4000');
