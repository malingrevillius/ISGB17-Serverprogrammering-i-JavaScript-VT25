'use strict';

const express = require('express');
const jsdom = require('jsdom');
const fs = require('fs');

//1 & 2. npm install cookie-parser + se till att den är användbar i er lösning.
const cookieParser = require('cookie-parser');

const app = express();

app.listen(3000, function() {
    console.log('Servern är uppe på port 3000!');
});

app.use('/openDir',express.static(__dirname + '/static'));
app.use(express.urlencoded( {extended : true} ));
//3. Ett middleware för kakor kan vara bra att ha.
app.use(cookieParser());

app.get('/', function(request, response) {

    //GET/POST demo i Postman
    console.log(request.query, request.query.yellow);

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

    let red, green, blue; //Default undefined!

    try {
        console.log( request.body );

        if(request.body !== undefined) { //Säkerställ att body inte är undefined!
            red = request.body.red;
            green = request.body.green;
            blue = request.body.blue;
        }

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

        //4. Skapa tre kakor: red, green & blue!
        response.cookie('red', red, {maxAge : 60 * 1000 * 5});
        response.cookie('green', green, {maxAge : 60 * 1000 * 5});        
        response.cookie('blue', blue, {maxAge : 60 * 1000 * 5});

        //Allt ok i gränssnittet
        fs.readFile(__dirname + '/static/html/index.html', function( err, data) {

            //Ngt gick fel med att läsa upp filen!
            if( err ) {
                console.log( err );
                response.send( err.toString );
            } else {
                //Allt ok med att läsa upp filen!

                let serverDOM = new jsdom.JSDOM(data);

                serverDOM.window.document.querySelector('#status').style.backgroundColor = 'rgb(' + red.toString() + ',' + green + ',' + blue + ')';

                data = serverDOM.serialize();

                response.send (data );
            }

        });

    }catch( oE ) {
        //Ngt gick fel med valideringen från gränssnittet.
        console.log(oE.message );
         //Allt ok i gränssnittet
         fs.readFile(__dirname + '/static/html/form.html', function( err, data) {

            //Ngt gick fel med att läsa upp filen!
            if( err ) {
                console.log( err );
                response.send( err.toString );
            } else {
            
                let serverDOM = new jsdom.JSDOM(data);

                if( red !== undefined ) { //red, green & blue är synliga eftersom de är skrivna innanför första spetsparantesen!
                    serverDOM.window.document.querySelector('[name=red]').setAttribute('value', red); //Observera att .value inte finns implementerat i jsdom!
                }

                if( green !== undefined ) {
                    serverDOM.window.document.querySelector('[name=green]').setAttribute('value', green);
                }

                if( blue !== undefined ) {
                    serverDOM.window.document.querySelector('[name=blue]').setAttribute('value', blue);
                }
               
                serverDOM.window.document.querySelector('#errorMsg').textContent = oE.message;

                data = serverDOM.serialize();

                response.send (data );
            }

        });
    }

});

//5. get på /reset

//6. get på /start
app.get('/start', function(request, response) {

    console.log(request.cookies, 'start');

    let red = request.cookies.red;
    let green = request.cookies.green;
    let blue = request.cookies.blue;

    if(red !== undefined && green !== undefined && blue !== undefined) {

        fs.readFile(__dirname + '/static/html/index.html', function( err, data) {

            //Ngt gick fel med att läsa upp filen!
            if( err ) {
                console.log( err );
                response.send( err.toString );
            } else {
                //Allt ok med att läsa upp filen!

                let serverDOM = new jsdom.JSDOM(data);

                serverDOM.window.document.querySelector('#status').style.backgroundColor = 'rgb(' + red + ',' + green + ',' + blue + ')';

                data = serverDOM.serialize();

                response.send (data );
            }

        });


    } else {
        response.redirect('/');
    }
});




