let http =require('http'), fs = require('fs');

function serveStaticFile(res, path, contentType, responseCode) {
    if (!responseCode) {
        responseCode = 200;
    }
    fs.readFile(__dirname + path, function(err, data) {
       if (err) {
           res.writeHead(500, {
               'Content-Type': 'text/plain'
           });
           res.end('500 - Internal Error');
       } else {
           res.writeHead(responseCode, {
               'Content-Type': contentType,
           });
           res.end(data);
       }
    });

}

http.createServer(function(req, res) {

    let path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();

    switch(path) {
        case '':
            serveStaticFile(res, '/public/home.html', 'text/html');
            break;
        case '/about':
            // res.writeHead(200, {
            //     'Content-Type': 'text/plain'
            // });
            // res.end('About');
            //
            let stream = fs.createReadStream('./lib/origin.json');
            stream.pipe(res);

            break;
        default:
            serveStaticFile(res, '/public/404.html', 'text/html');
            break;
    }

}).listen(3000);

console.log('server started on localhost:3000; press ctrl-c to terminate....');