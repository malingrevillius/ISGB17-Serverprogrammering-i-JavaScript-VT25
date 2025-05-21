'use strict';

// Skapa en Socket.io-anslutning till servern. 
const socket = io(); 

// Logga när anslutningen sker.  
// När klienten ansluter till servern, skriv ett meddelande i konsolen.
socket.on('connect', ()=>{
    console.log('Ansluten till servern via socket.io');
});

// Vänta tills hela dokumentet har laddats innan du kör koden.  
document.addEventListener('DOMContentLoaded', function(){
    // Hämta alla knappar med klassen 'birdbutton'.
    let buttons = document.querySelectorAll('.birdbutton');
    // Lägg till en klicklyssnare på varje knapp. 
    for(let i = 0; i < buttons.length; i++){
        buttons[i].addEventListener('click', function(e){
            // Förhindra att standardåtgärden för knappen utförs (t.ex. formulärskick).
            e.preventDefault;
            // Hämta fågel-id från knappens data-attribut.
            const birdId = buttons[i].getAttribute('data-birdid');
            // Logga vilket fågel-id som valts.
            console.log('Valt fågel-ID är ' + birdId);
            // Skicka en händelse till servern med det valda fågel-id:t.
            socket.emit('newBackground', {birdId});
        });
    }
});  
// Lyssna på 'bytbakgrund'-händelsen som kommer från servern.
socket.on('bytbakgrund', (data)=>{
    // Extrahera birdId, nickname och timestamp från datan som skickats.
    const {birdId, nickname, timestamp} = data; 
    // Logga information om vilken användare som ändrade bakgrunden och när.
    console.log(`${nickname} changed background at ${timestamp}: fågel-ID = ${birdId}`);

    // Ändra bakgrundsbilden på hela sidan till den nya fågelbilden. 
    document.body.style.backgroundImage = `url("/public/images/${birdId}.jpg")`;
    // Sätt bakgrundsbilden till att täcka hela sidan.
    document.body.style.backgroundSize = 'cover';  
    // Förhindra att bakgrunden upprepas. 
    document.body.style.backgroundRepeat = 'no-repeat'; 
    // Centrera bakgrundsbilden.
    document.body.style.backgroundPosition = 'center';

    // Hitta elementet med klassen 'lead'. 
    const lead = document.querySelector('.lead'); 
    // Om elementet finns, skapa ett nytt stycke (p-element). 
    if(lead){
        let p = document.createElement('p');
        // Sätt texten till information om vem som ändrade bakgrunden och när. 
        p.textContent = `${nickname} ändrade bakgrunden vid tiden ${timestamp}.`; 
        // Lägg till det nya stycket i lead-elementet. 
        lead.appendChild(p);
    } 
});
  
  

  

 

