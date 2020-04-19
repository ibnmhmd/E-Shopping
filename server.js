// GitHub source: server.js
require('zone.js/dist/zone-node');
require('reflect-metadata');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const api = require('./server/routes/api');
const fs = require('fs');
const { platformServer, renderModuleFactory } = require('@angular/platform-server');
const { ngExpressEngine } = require('@nguniversal/express-engine');
// Import the AOT compiled factory for your AppServerModule.
// This import will change with the hash of your built server bundle.
const { AppServerModuleNgFactory } = require(`./dist/dist-server/main.bundle`);
const app = express();
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost:${port}`;
// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Set the engine
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory
}));
app.set('view engine', 'html');
app.set('views', './dist');
// API location
app.use('/', api);

app.use(express.static(path.join(__dirname, './dist'), {index: false}));
//app.use('/', express.static('./', {index: false}));
app.get('/*', (req, res) => {
  //res.sendFile(path.join(__dirname + '/dist/index.html'));
  res.render('index', {
    req,
    res
  });
});


const forceSSL = function() {
    return function (req, res, next) {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(
         ['https://', req.get('Host'), req.url].join('')
        );
      }
      next();
    }
  }
  // Instruct the app
  // to use the forceSSL
  // middleware
app.use(forceSSL());

app.listen( port, () => {
  console.log(`Listening at ${baseUrl}`);
});


// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const http = require('http');
// const app = express();
// const api = require('./server/routes/api');

// // If an incoming request uses
// // a protocol other than HTTPS,
// // redirect that request to the
// // same url but with HTTPS

// // Parsers
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false}));

// // Angular DIST output folder
// app.use(express.static(path.join(__dirname, '/dist')));

// // API location
// app.use('/', api);
// // Send all other requests to the Angular app
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });
// //&& cpy mongodb.config.js dist && cpy server/routes/api.js dist && cpy src/AES.passwordEncrypter.Decrypter.js dist && cpy server.js dist
// const forceSSL = function() {
//     return function (req, res, next) {
//       if (req.headers['x-forwarded-proto'] !== 'https') {
//         return res.redirect(
//          ['https://', req.get('Host'), req.url].join('')
//         );
//       }
//       next();
//     }
//   }
//   // Instruct the app
//   // to use the forceSSL
//   // middleware
// app.use(forceSSL());

// app.get('/getUsers', (req, res) => {
//     console.log('get users . . .');
// })
// //Set Port
// const port = process.env.PORT || '3000';
// app.set('port', port);

// const server = http.createServer(app);

// server.listen(port, () => console.log(`Running on localhost:${port}`));