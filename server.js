var app = require('./config/express')();
var passport = require('./config/passport')(app);
var database = require('./config/database')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 4000);
console.log('Server Running');

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log('Connected: ' + connections.length + ' Sockets connected');

    //Disconnected
    socket.on('disconnect', function(data) {
        io.sockets.emit('user off', users.splice(users.indexOf(socket.username), 1));
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: ' + connections.length + ' Sockets connected');
    });

    //Message
    socket.on('send message', function(data) {
        io.sockets.emit('new message', {
            msg: data,
            user: socket.username
        });
    });

    //new users
    socket.on('new username', function(data, callback) {
        callback(true);
        if (users.indexOf(data) == -1) {
            socket.username = data;
            io.sockets.emit('new user in', data);
            console.log("new user in " + data);
            users.push(socket.username);
            updateUsernames();
        } else {
            socket.username = data;
            updateUsernames();
        }
    });

    function updateUsernames() {
        io.sockets.emit('get users', users);
    }
});
