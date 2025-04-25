'use strict';
const http = require('http');
const fs = require('fs');

  
  http.createServer(function (req, res) {

    

    if(req.url === '/') {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(fs.readFileSync('index.html').toString());
      res.end();
    }
    else {
      let fileToSend;
      let url = req.url;
      console.log('url:', url);

      url = url.substring(1);
      console.log('filename: ', url);

      fs.stat(url, function(err, stats) {
        if(err) {
          res.writeHead(404, {'Content-Type': 'text/html'});
          res.end();
        }
        else {

          let lastDot = url.lastIndexOf('.'); 
          console.log('Sista punkten finns på postion: ', lastDot);
          let fileExt = url.substring(lastDot + 1);
          console.log('filändelsen är: ', fileExt);

          switch(fileExt) {

            case 'png':
              res.writeHead(200, {'Content-Type': 'image/png'}); //png
              fileToSend = fs.readFileSync(url); //Binär
              break;
              
            default: 
              res.writeHead(200, {'Content-Type': 'text/html'}); //html
              fileToSend = fs.readFileSync(url).toString(); //Text
              break;

          }

          res.write(fileToSend);
          res.end();
        }
      
      });
    }


    
  }).listen(3000);



