'use strict';
const socket = io();

window.addEventListener('load', ()=> {
    document.querySelector('.btn').addEventListener('click', buttonClick);
});


function buttonClick() {
    socket.emit('banan',null);
}

socket.on('silverfisk', function(data){

    console.log('Silverfisk!!!');
    let body = document.querySelector('body');

    let myStyle = "background-color: rgb(" + data.red + "," + data.green + "," + data.blue + ");";
    body.setAttribute('style',myStyle);

});