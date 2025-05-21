'use strict';

// Importera Express-modulen för att skapa en webbserver. 
const express = require('express'); 

// Importera Node.js inbyggda `path`-modul för att hantera filsökvägar.
const path = require('path');

// Importera `cookie-parser` för att kunna läsa cookies från inkommande HTTP-förfrågningar. 
const cookieParser = require('cookie-parser');

// Importera `Server`-klassen från Socket.io för att möjliggöra realtidskommunikation. 
const {Server} = require('socket.io'); 

// Importera ett eget modulskript som ligger i samma katalog (`my-module.js`). 
const myModule = require('./my-module.js'); 

// Skapa en instans av en Express-applikation. 
const app = express();

// Sätt portnumret som servern ska lyssna på (3001).
const port = 3001;
//________________________________________________________________________________________

// Använd cookieParser-middleware för att läsa cookies från förfrågningar.
app.use(cookieParser());  

// Använd middleware för att tolka `application/x-www-form-urlencoded`-data från formulär. 
app.use(express.urlencoded({extended : true}));

// Gör katalogen `public` tillgänglig som statiska filer under `/public`-sökvägen.
app.use('/public', express.static(__dirname + '/public'));  

//__________________________________________________________________________________________

// Definiera en GET-route för hemsidan ("/").
// Hämta `nickname` från cookies.  
// Om `nickname` finns, skicka `index.html` till klienten.  
// Annars skicka `loggain.html` till klienten.
app.get('/', function(req, res){
    const nickname = req.cookies.nickname;
    if(nickname)
        res.sendFile(path.join(__dirname, 'index.html'));
    else
        res.sendFile(path.join(__dirname, 'loggain.html'));
}); 

// Definiera en POST-route för samma väg ("/").  
// Hämta `nickname` från formulärdatan i POST-förfrågan.  
// Om ett nickname skickats, lagra det i en cookie med en livstid på 1 dag.  
// Skicka tillbaka användaren till hemsidan genom en redirect. 
app.post('/', (req, res) =>{
    const nickname = req.body.nickname;
    if(nickname){
        res.cookie('nickname', nickname, { maxAge : 1000 * 60 * 60 * 24 });
    }
    res.redirect('/');
});
//________________________________________________________________________________

// Starta Express-servern och lyssna på den angivna porten.  
// Logga ett meddelande till konsolen om att servern körs. 
const server = app.listen(port, function(){
    console.log('Server is running');
}); 

// Skapa en Socket.io-server baserat på den redan startade Express-servern.
const io = new Server(server);  

// Lyssna efter att en ny klient ansluter via Socket.io. 
// Logga ett meddelande när en klient har anslutit.
io.on('connection', function(socket){
    console.log('User connected to server');

    // Lyssna efter `newBackground`-meddelanden från klienten. 
    socket.on('newBackground', (data) =>{
        // Parsa cookies från klientens Socket.io-förfrågan.
        const cookies = myModule.parseCookies(socket.request.headers.cookie || "");
        // Hämta `nickname` från cookies, eller sätt till "okänd" om det saknas. 
        const nickname = cookies.nickname || 'okänd'; 
        // Hämta en tidsstämpel från den egna modulen.
        const timestamp = myModule.getTimeStamp();  
        // Hämta `birdId` från data som skickades från klienten.
        const birdId = data.birdId;
        // Skapa ett objekt med användarnamn, tid och fågel-id.  
        const object = {nickname, timestamp, birdId};
        // Skicka detta objekt till alla anslutna klienter via Socket.io.
        io.emit('bytbakgrund', object);
    }); 
});
  

  

