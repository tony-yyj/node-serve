// 提供http服务端和客户端功能
let http = require('http');
// 提供文件系统相关功能
let fs = require('fs');
// 提供与文件系统路径相关功能
let path = require('path');
// 根据文件扩展名得出MIME类型的能力
let mime = require('mime');
// 缓存文件内容的对象
let cache = {};

let update = require('./lib/update');

function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(200, {
        "Content-Type": mime.getType(path.basename(filePath))
    });
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    // 检查文件是否缓存在内存中
    if (cache[absPath]) {
        // 从内存中返回文件
        sendFile(response, absPath, cache[absPath]);
    } else {
        // 检查文件是否存在
        fs.exists(absPath, function(exists) {
            if (exists) {
                // 从内存中读取文件
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        // 将文件缓存，并返回响应
                        // cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                // 文件不存在返回404
                send404(response);
            }
        })
    }
}

// 创建http服务器，定义对请求的处理
let server = http.createServer(function(request, response) {
    if (request.url === '/update') {

        const fileName = '/Users/tony/oneroot/obj/dcex-counter-frontend/src/assets/i18n/ko.json';
        // 处理更新
        update.updateJson(fileName, response);
    } else {
        let filePath = false;
        // 处理请求的文件路径
        if (request.url === '/') {
            filePath = 'public/index.html'
        } else {
            filePath = 'public' + request.url;
        }
        let absPath = './' + filePath;
        // 返回静态文件
        serveStatic(response, cache, absPath);
    }

});


server.listen(3000, function() {
    console.log("server listening on port 3000");
});
