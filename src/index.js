const express = require('express');
const path = require("path");
const socketio = require("socket.io");
const http = require("http");
const { generateMessage, generatelocationMessage } = require("./utils/messages")
const { addUser, removeUser, getUsersInRoom, getUser }  = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT||3000;

const publicDirectoryPath = path.join(__dirname,"../public");

app.use(express.static(publicDirectoryPath));

server.listen(port,()=>{
    console.log(`Server is running at port ${port}!`);
})
io.on("connection",(socket)=>{
    console.log('New WebSocket connection: ',socket.id)

    socket.on("join",({username,room},callback)=>{

        const{ error, user } =  addUser({id:socket.id,username:username,room:room});

        if(error){
            return callback(error);
        }

        socket.join(user.room); 

        socket.broadcast.to(user.room).emit("sendMessage",generateMessage("Admin",`${user.username} has joined`));
        const userList = getUsersInRoom(user.room);
        io.to(user.room).emit("sendUserList",{room,userList});
        callback();
    });

    socket.on("message",(message,callback)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit("sendMessage",generateMessage(user.username,message));
        callback(); 
    });
    socket.on("currentLocation",(position,callback)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit("sendLocation",generatelocationMessage(user.username,`https://google.com/maps?q=${position.latitude},${position.longitude}`));
        callback();
    });

    socket.on("disconnect",()=>{
        const user = removeUser(socket.id);
        console.log("remove id:",socket.id," user",user)
        if(user){
            const room = user.room;
            const userList = getUsersInRoom(room)
            io.to(user.room).emit("sendUserList",{room,userList});
            io.to(user.room).emit("sendMessage",generateMessage("Admin",`${user.username} has left the room`));
        }
})
});






