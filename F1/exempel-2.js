'use strict';

const fs = require('fs');

let filnamn = 'test.txt';

fs.stat(filnamn, function(err, stats){
    if(err){
        console.error('Filen finns ej');
    }
    else {
        fs.watch(filnamn, function(){
            console.log('filen har ändrats');
            console.log(fs.readFileSync(filnamn).toString());
        });
    }
})