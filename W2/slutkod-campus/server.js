'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const { parseCookies } = require('./my-module.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3001;

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));

// GET /
app.get('/', (req, res) => {
    if (req.cookies.nickname) {
        res.sendFile(__dirname + '/index.html');
    } else {
        res.sendFile(__dirname + '/loggain.html');
    }
});

// POST /
app.post('/', (req, res) => {
    const nickname = req.body.nickname;

    if (nickname && nickname.length > 2) {
        res.cookie('nickname', nickname, { httpOnly: true });
    }

    res.redirect('/');
});

// 🔌 Socket.io
io.on('connection', (socket) => {
    console.log('socket anslutning igång');

    socket.on('newBackGround', (birdId) => {
        const cookieHeader = socket.handshake.headers.cookie || '';
        const cookies = parseCookies(cookieHeader);
        const nickname = cookies.nickname || 'okänd';

        console.log(`Mottog ny bakgrund: ${birdId} från ${nickname}`);

        // Skicka till alla klienter
        io.emit('changebkg', {
            birdId: birdId,
            nickname: nickname
        });
    });
});

// Starta servern
server.listen(port, () => {
    console.log(`Servern körs på http://localhost:${port}`);
});
