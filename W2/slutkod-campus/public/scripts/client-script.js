'use strict';

const socket = io();

socket.on('connect', () => {
    console.log('socket anslutning igång');
});

// Lägg till lyssnare när DOM:en är laddad
document.addEventListener('DOMContentLoaded', () => {
    // Knappar för fåglar
    document.querySelectorAll('.birdbutton').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const birdId = button.getAttribute('data-birdid');
            if (birdId) {
                socket.emit('newBackGround', birdId);
            }
        });
    });

    // Ta emot förändring från servern
    socket.on('changebkg', ({ birdId, nickname }) => {
        // Ändra bakgrundsbild
        document.body.style.backgroundImage = `url("/public/images/${birdId}.jpg")`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';

        // Lägg till rad i <p class="lead">
        const leadParagraph = document.querySelector('p.lead');
        if (leadParagraph) {
            const newLine = document.createElement('br');
            const userInfo = document.createTextNode(`Bakgrund ändrad av: ${nickname}`);
            leadParagraph.appendChild(newLine);
            leadParagraph.appendChild(userInfo);
        }
    });
});
