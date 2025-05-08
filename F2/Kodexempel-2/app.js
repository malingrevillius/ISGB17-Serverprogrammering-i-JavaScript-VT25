'use strict';
const fs = require('fs');

rakna().then(function(varde) {
    console.log('Det var ' + varde + ' antal tecken i filen');
}).catch(function(err) {

});





async function rakna() {
    console.log('start filläsning');

    let stoooorFil = await fs.readFileSync('stor-fil.txt').toString();

    console.log('Filläsning klar, börjar loop!');
    let raknare;
    for(let i=0;i<1000;i++) {
        raknare = 0;
        for(let j=0; j<stoooorFil.length;j++) {
            if(stoooorFil[j]=='a') {
                raknare++;
            }
        }
    }

    console.log('Beräkningar färdiga');

    return Promise.resolve(raknare);

}