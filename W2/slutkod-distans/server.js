const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const myModule = require('./my-module');


const app = express();
const port = 3001;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, 'public')));

// GET /
app.get('/', (req, res) => {
    const nickname = req.cookies.nickname;
    if (nickname) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        res.sendFile(path.join(__dirname, 'loggain.html'));
    }
});

// POST /
app.post('/', (req, res) => {
    const nickname = req.body.nickname;
    if (nickname) {
        res.cookie('nickname', nickname, { maxAge: 24 * 60 * 60 * 1000 });
    }
    res.redirect('/');
});

// Starta servern med Express och koppla på Socket.io utan http.createServer
const server = app.listen(port, () => {
    console.log(`Servern körs på http://localhost:${port}`);
});

// Socket.io kopplas på den redan lyssnande Express-servern
const io = new Server(server);

// Socket.io-anslutning
io.on('connection', (socket) => {
    console.log('En klient har anslutit via Socket.io');

    socket.on('newBackground', (data) => {
        const cookies = myModule.parseCookies(socket.request.headers.cookie || '');
        const nickname = cookies.nickname || 'okänd';
        const timestamp = myModule.getTimeStamp();
        const birdId = data.birdId;

        const payload = {
            nickname,
            timestamp,
            birdId
        };

        // Skicka till alla klienter
        io.emit('bytbakgrund', payload);
    });
});