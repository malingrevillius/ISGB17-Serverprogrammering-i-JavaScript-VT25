'use strict';

//Import av kodbibliotek
const express = require('express');
const {Server} = require('socket.io'); //Hämtar enbart Server-klassen från kodbiblioteket socket.io och döper det till "Server"
const app = express();

//Startar upp express http-server och sparar en kopia av servern med namnet httpserver
const httpserver = app.listen(3001, function(){
    console.log('Servern kör!');
});

//Startar upp en instans av Serverklassen med express-http-servern som parameter
const io = new Server(httpserver);

//Middleware för att "servera" klienten med alla filer i mappen clientsscripts under url'en /silverfisk
app.use('/silverfisk', express.static(__dirname + '/clientscripts'));

//Root endpoint 
app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
});

//Endpoint för att öppna upp favicon
app.get('/favicon.ico', function(req,res){
    res.sendFile(__dirname + '/favicon.ico');
});

//Lyssnare för socket-anslutningar
io.on('connection', function(socket) {
    console.log('En användare anslöt via socket!');

    //Socketlyssnare som lyssnar efter sockethändelsen banan
    socket.on('banan', function() {

        console.log('banan!!!!');

        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);

        //Skicka socket-händelsen silverfisk till ALLA anslutna klienter
        io.emit('silverfisk', {
            'red': r,
            'green': g,
            'blue': b
        });

    });



    //Lyssnare för sockethändelsen disconnect
    socket.on('disconnect',function(){
        console.log('En användare stängde anslutningen');
    })

} );

