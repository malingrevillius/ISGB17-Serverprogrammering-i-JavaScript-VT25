'use strict';

const fs = require('fs');
const http = require('http');
const uc = require('upper-case');

http.createServer(function(req,res){
    console.log('nätverksanrop!');

    let htmlstring = fs.readFileSync('minHtmlFil.html').toString();

    res.writeHead(200, { 'Content-Type' : 'text/html' });

    let versalstring = uc.upperCase(htmlstring);
    res.end(versalstring);


}).listen(3005);