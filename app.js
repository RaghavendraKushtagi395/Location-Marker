const express = require('express');
const app = express();
const http = require('http')
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const path = require('path');

const port = 7000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
    socket.on('send-location', function(data){
        io.emit('receive-location', {id: socket.id, ...data});
    });
    console.log("New WebSocket connection");
    socket.on('disconnect', function(){
        io.emit("User connection closed",socket.id);
    });
    
});

app.get('/', function (req, res) {
    res.render('index');
});



server.listen(port);