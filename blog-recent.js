let http = require('http'), fs = require('fs');

function getTitles(res) {
    fs.readFile('./public/blog/titles.json', function(err, data){
       if (err) {
           return handleError(err, res);
       }
        let titles = JSON.parse(data.toString());
        getTemplate(res, titles);
    });
}

function getTemplate(res, titles) {
    fs.readFile('./public/blog/template.html', function(err, data){
        if (err) {
            return handleError(err, res);
        }
        let tmpl = data.toString();
        formateHtml(titles, tmpl, res);
    })
}

function formateHtml(titles, tmpl, res) {
    let html = tmpl.replace('%', titles.join('</li><li>'));
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(html);
}

function handleError(err, res) {
    console.error(err);
    res.end('server error');
}

http.createServer(function(req, res){
    if (req.url === '/') {
        getTitles(res);
    }
}).listen(3000);