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

    console.log(request.method, request.url);

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

        if( red === undefined || green === undefined || blue === undefined) {
            throw new Error('Ange ett färgvärde"!');
        }

        red = red.trim();
        green = green.trim();
        blue = blue.trim();

        if( red.length === 0 || green.length === 0 || blue.length === 0) {
            throw new Error('Färg får inte vara tomt!');
        }

        if( isNaN( red ) || isNaN( green ) || isNaN( blue )) {
            throw new Error ('Ange ett heltal!');
        }

        red = parseInt(red);
        green = parseInt(green);
        blue = parseInt(blue);

        if( ( red < 0 || red > 256 ) || ( green < 0 || green > 256 ) || ( blue < 0 || blue > 256 )) {
            throw new Error('Färg ska vara 0-255!');
        }

        //Allt ok i gränssnittet
        fs.readFile(__dirname + '/static/html/index.html', function( err, data) {

            //Ngt gick fel med att läsa upp filen!
            if( err ) {
                console.log( err );
                response.send( err.toString );
            } {
                //Allt ok med att läsa upp filen!

                let serverDOM = new jsdom.JSDOM(data);

                serverDOM.window.document.querySelector('#status').style.backgroundColor = 'rgb(' + red.toString() + ',' + green + ',' + blue + ')';

                data = serverDOM.serialize();

                response.send (data );
            }

        });

    }catch( oE ) {
        //Ngt gick fel med valideringen från gränssnittet.

         //Allt ok i gränssnittet
         fs.readFile(__dirname + '/static/html/form.html', function( err, data) {

            //Ngt gick fel med att läsa upp filen!
            if( err ) {
                console.log( err );
                response.send( err.toString );
            } {
                //Allt ok med att läsa upp filen!

                let serverDOM = new jsdom.JSDOM(data);

                if( request.body.red !== undefined ) {
                    serverDOM.window.document.querySelector('[name=red]').setAttribute('value', request.body.red);
                }

                if( request.body.green !== undefined ) {
                    serverDOM.window.document.querySelector('[name=green]').setAttribute('value', request.body.green);
                }

                if( request.body.blue !== undefined ) {
                    serverDOM.window.document.querySelector('[name=blue]').setAttribute('value', request.body.blue);
                }
               
                serverDOM.window.document.querySelector('#errorMsg').textContent = oE.message;

                data = serverDOM.serialize();

                response.send (data );
            }

        });
    }

});
