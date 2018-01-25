var Chat = function(socket) {
    this.socket = socket;

    /**
     * 发送消息
     * @param {*} room 
     * @param {*} text 
     */
    this.sendMessage  = function(room, text) {
        var message = {
            room: room,
            text: text,
        };
        this.socket.emit('message', message);
        console.log('send message', message);
    }

    this.changeRoom = function(room) {
        this.socket.emit('join', {
            newRoom: room,
        });
    }

    this.processCommand = function(command) {
        var words = command.split(' ');
        var command = words[0].substring(1, words[0].length).toLowerCase();
        var message = false;
        switch(command) {
            case 'join':
                words.shift();
                var room = words.join(' ');
                this.changeRoom(rooom);
                break;
            case 'nick':
                words.shift();
                var name = words.join(' ');
                this.socket.emit('nameAttempt', name);
                break;
            default:
                message = 'Unrecognized command';
                break;
        }
        return messgae;
    }
}
