'use strict';

/*
    Skapa ett projekt: npm init
    Installera express: npm install express
    Installera jsdom: npm install jsdom
    Kanske installera nodemon lokalt.

    1. Starta en webbserver som svarar på port 3000
    2. Lägg till ett middleware för att exponera lämplig mapp (se form.html och katalogstruktur)
    3. Lägg till ett middleware för att kunna avkoda data från formulär (se form.html)

    4. Lägg till endpoint på / för get
    4.1 Vid anrop skicka asynkront form.html till klienten. 
    4.2 Om något går fel returnera felet till klienten och skriv lämlig utdata till konsolen.
    4.3 Om allt gick bra skriv lämplig utdata till konsolen.

    5. Lägg till endpoint på / för post
    5.1 Använd undantagshantering och kontrollera indata för undefined, tomt, numeriskt värde, värde mellan 0-255.
    5.2 Om något utvärderas till true ska ett undantag kastas. 
    5.3 Om ett undantag har kastas skapa en server DOM av form.html (läs in med asynkon metod och hantera enligt 4.2-4.3) och om det har inkommit några värden återplacera dessa i respektive element.
    5.4 Till elementet med id errorMsg skriv ut texten i undantaget som har kastats.
    5.5 Skicka den modifierade server DOM till anropande klient.
    5.6 Om inget har utvärderats till false skapa en server DOM av index.html (läs in med asynkon metod och hantera enligt 4.2-4.3).
    5.7 Modifiera elmentet med id status till att erhålla en backgrundsfärg (rgb()) baserad på inkommande värden.
    5.8 Skicka den modifierade server DOM till anropande klient.
    
    För att testa er lösning använd både webbläsare och Postman.

*/

const express = require('express');
const jsdom = require('jsdom');
const fs = require('fs');

const app = express();

app.listen(3000, function() {
    console.log('Servern är uppe på port 3000!');
});

app.use('/openDir',express.static(__dirname + '/static'));
app.use(express.urlencoded( {extended : true} ));

app.get('/', function(request, response) {

    response.sendFile(__dirname + '/static/html/form.html', function(err) {
        if( err ) {

            console.log( err );
            response.send(err.message);

        } else {

            console.log('Allt ok!');
        }
    });
});

//POST på rooten?
app.post('/', function(request, response) {

    console.log( request.body );

    try {
        let red = request.body.red;
        let green = request.body.green;
        let blue = request.body.blue;

        if( red === undefined) {
            throw new Error('Ange färg"!');
        }

        red = red.trim();

        if( red.length === 0) {
            throw new Error('Tomt värde!');
        }

        if( isNaN( red )) {
            throw new Error ('Ange tal!');
        }

        red = parseInt(red);

        if( red < 0 || red > 256) {
            throw new Error('Färg ska vara 0-255!');
        }

        fs.readFile(__dirname + '/static/html/index.html', function( err, data) {

            //Kontrollera att allt är ok eller inte...

            let serverDOM = new jsdom.JSDOM(data);

            serverDOM.window.document.querySelector('#status').style.backgroundColor = 'rgb(' + red.toString() + ',' + green + ',' + blue + ')';

            data = serverDOM.serialize();

            response.send (data );

        });

    }catch( err ) {

        //Använd med fördel koden ovan för att lösa den sista delen av uppgiften.
        console.log( err.message );
    }

});
