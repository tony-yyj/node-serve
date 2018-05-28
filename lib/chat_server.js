var socketio = require('socket.io');

var io;
// 访问人数
var guestNumber = 1;
// 昵称
var nickNames = {};
// 已用的名字
var namesUsed = [];
// 当前房间
var currentRoom = {};

/**
 * 分配昵称
 * @param {*} socket 
 * @param {*} guestNumber 
 * @param {*} nickNames 
 * @param {*} namesUsed 
 */
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    var name = 'Guest' + guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult', {
        success: true,
        name: name,
    });
    namesUsed.push(name);
    return guestNumber + 1;
}

/**
 * 进入房间
 * @param {*} socket 
 * @param {*} room 
 */
function joinRoom(socket, room) {
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit('joinResult', {
        room: room,
    });
    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + ' has joined ' + room + '.',
    });

    var usersInRoom = 0;
    io.in(room).clients(function(error,clients){
        usersInRoom = clients.length;
    });
    if (usersInRoom.length > 1) {

        var userInRoomSummary = 'Users currently in ' + room + ':';
        for (var index in usersInRoom) {
            var userSocketId = usersInRoom[index].id;
            if (userSocketId != socket.id) {
                if (index > 0) {
                    userInRoomSummary += ', ';
                }
                userInRoomSummary += nickNames[userSocketId];
            }
        }
        userInRoomSummary += '.';
        socket.emit('message', {
            text: userInRoomSummary,
        });
    }
}

/**
 * 处理用户的消息
 * @param {*} socket 
 * @param {*} nickNames 
 */
function handleMessageBroadcasting(socket, nickNames) {
    socket.on('message', function(message) {
        console.log(message);
        socket.broadcast.emit('message', {
            text: nickNames[socket.id] + ': ' + message.text,
        });
    })
}

/**
 * 用户更名
 * @param {*} socket 
 * @param {*} nickNames 
 * @param {*} namesUsed 
 */
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    socket.on('nameAttempt', function(name) {
        if (name.indexOf('Guest') == 0) {
            socket.emit('nameResult', {
                success: false,
                message: 'Names cannot be gin with "Guest".',
            });
        } else {
            if (namesUsed.indexOf(name) == -1) {
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;
                // 删掉之前的名称
                delete namesUsed[previousNameIndex];
                socket.emit('nameResult', {
                    success: true,
                    name: name,
                });
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + ' is now known as ' + name + '.',
                });
            } else {
                socket.emit('nameResult', {
                    success: false,
                    message: 'that name is already in use.',
                });
            }
        }
    });
}

/**
 * 离开旧房间加入新房间
 * @param {*} socket 
 */
function handleRoomJoining(socket) {
    socket.on('join', function(room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
    })
}

/**
 * 断开连接的处理
 * @param {*} socket 
 * @param {*} nickNames 
 * @param {*} namesUsed 
 */
function handleClientDisconnection(socket, nickNames, namesUsed) {
    socket.on('disconnect', function() {
        var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    })
}

exports.listen = function(server) {
    io = socketio.listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', function(socket) {
        // 连接上来时赋予一个访客名
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
        joinRoom(socket, 'Lobby');

        handleMessageBroadcasting(socket, nickNames);

        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);

        socket.on('rooms', function() {
            socket.emit('rooms', io.sockets.adapter.rooms);
        });

        handleClientDisconnection(socket, nickNames, namesUsed);
    });
};