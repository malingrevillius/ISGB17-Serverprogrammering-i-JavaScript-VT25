const socket = io();

// Logga när anslutningen sker
socket.on('connect', () => {
    console.log('Ansluten till servern via Socket.io');
});

// Lyssna på klick på alla knappar med klassen 'birdbutton'
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.birdbutton');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const birdId = button.getAttribute('data-birdid');
            console.log(`Knapp klickad: fågel-id = ${birdId}`);

            // Skicka händelse till servern
            socket.emit('newBackground', { birdId });
        });
    });
});

// Lyssna på händelsen 'bytbakgrund' från servern
socket.on('bytbakgrund', (data) => {
    const { birdId, nickname, timestamp } = data;
    console.log(`Mottog bakgrundsändring från ${nickname} (${timestamp}): fågel-id = ${birdId}`);

    // Ändra bakgrundsbild
    document.body.style.backgroundImage = `url("/public/images/${birdId}.jpg")`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center';

    // Lägg till info i .lead
    const leadElement = document.querySelector('.lead');
    if (leadElement) {
        const p = document.createElement('p');
        p.textContent = `Bakgrund ändrad av ${nickname} (${timestamp})`;
        leadElement.appendChild(p);
    }
});
