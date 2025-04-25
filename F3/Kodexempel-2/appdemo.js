'use strict';
//Skapa projekt: npm init
//nodemon finns sedan tidigare installerat globalt (npm install -g nodemon)
//installera express: npm install express
//installera jsDOM: npm install jsdom

//installera nodemon install -g nodemon
//För Mac rekommenderas att installera lokalt annars behöver ni se över rättigheter.
//https://www.npmjs.com/package/nodemon

//2.1-2.3
//1. Starta upp en express-server som lyssnar på port 3000.
//2. Lägg till get end-point "/" och skicka static/html/index.html och använd asynk-funktion.
//3. Lägg till get end-point "/favicon.ico" och skicka static/ico/favicon.ico och använd asynk.

//2.4-2.6
//4. Lägg till middleware för /static och urlencoded för formulär.
//5. Lägg till post end-point för "/" och kontrollera indata samt skicka static/html/index.html och använd asynk-funktion. Använda Postman för att testa!
//6. Lägg till put och delete end-points för "/" samt skicka static/html/index.html och använd asynk-funktion. Använda Postman för att testa!

//7.
// /Om tid finnes och ni vill gräva på egen hand. Mer kommer workshop 1.
//Jobba med jsdom se https://www.npmjs.com/package/jsdom

const express = require('express');

let app = express();

app.listen(3000, function() {
    console.log('Japp servern är igång på port 3000!');
});

app.get('/', function(request, response) {

    console.log( request.method, request.url);

    response.sendFile(__dirname + '/static/html/index.html', function( err ) {
        //felmeddelande till klienten...
    });

});

app.use('/diverse', express.static(__dirname + '/static'));
app.use(express.urlencoded( { extended : true } ));

app.post('/', function(request, response) {

    console.log(request.body, request.body.courseCode, request.body.btnSend);


});
