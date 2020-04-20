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
const { AppServerModuleNgFactory } = require('./angularDist/dist-server/main.bundle');
const app = express();
const port = process.env.PORT || 3000;
const baseUrl = `http://localhost: ${port}`;
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
app.get('/*', (req, res) => {
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

app.listen(port, () => {
  console.log(`Listening at ${baseUrl}`);
});