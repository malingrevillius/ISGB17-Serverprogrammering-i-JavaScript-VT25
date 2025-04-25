const http = require('http');
const fs = require('fs');

http.createServer(function (req,res) {

    let fileToSend;

    if(req.url == '/') {
        fileToSend = 'index.html';
    } 
    else {
        fileToSend = req.url;
        fileToSend = fileToSend.substring(1);
    }

    fs.stat(fileToSend, function(err, stats) {
        if(err) {
            res.writeHead(404, { 'Content-Type': 'text/html'});
            res.end(err.toString());
        }
        else {
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write(fs.readFileSync(fileToSend).toString());
            res.end();
        }
    })

}).listen(3000);