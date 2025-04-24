'use strict';
const http = require('http');
const fs = require('fs');

exports.myServer = function() {

http.createServer(function(req,res){

    console.log(req.url);
    let filnamn;
    if(req.url == '/') {
        filnamn = 'index.html';
    }
    else {
        filnamn = req.url;
        filnamn = filnamn.substring(1);
    }

    fs.stat(filnamn, function(err, stats) {

        if(err) {
            res.writeHead(404, { 'Content-Type' : 'text/html'});
            res.end('<h1>Sidan finns inte!</h1><p>Lär dig stava!</p><script>console.log("thjo!");</script>');
        }
        else {
            let html = fs.readFileSync(filnamn).toString();
            res.writeHead(200, { 'Content-Type' : 'text/html'});
            res.end(html);
        }

    });



}).listen(3005);

}