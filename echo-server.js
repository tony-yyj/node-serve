let net = require('net');

net.createServer(function(socket) {
    socket.on('data', function(data){
        socket.write('you say is ' + data);
    })
}).listen(3000);