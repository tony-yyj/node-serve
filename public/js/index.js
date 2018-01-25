var socket = io();

$(document).ready(function(){
    var chatApp = new Chat(socket);

    socket.on('rooms', function(rooms){
        $('#room-list').empty();
        console.log(rooms);
        for(var room in rooms) {
            room = room.substring(1, room.length);
            if (room) {
                $('#room-list').append(divEscapedContentElement(room));
            }
        }
    });

    socket.on('message', function(message){
        console.log('accept messgae:', message);
        var newElement = $('<div></div>').text(message.text);
        $('#messages').append(newElement);
    });

    socket.on('joinResult', function(result){
        $('#room').text(result.room);
        $('#messages').append(divEscapedContentElement('Room changed.'));
    });

    // setInterval(function(){
    //     socket.emit('rooms');
    // }, 1000);

    $('#update-room').click(function(){
        socket.emit('rooms');

    });


    $('#send-form').submit(function(){
        processUserInput(chatApp, socket);
        return false;
    });
});