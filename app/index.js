const express = require("express");
const timeout = require('connect-timeout');
const bodyParser = require('body-parser');
const _ = require('lodash');

const env = process.env.NODE_ENV || "development";
const config = require('./config/config.js')[env];

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var jsonParser = bodyParser.json();

console.log("port: ", config.serverPort)

// startup check
// app.listen(config.serverPort, '192.168.1.12', function (err) {
app.listen(config.serverPort, '192.168.1.12', function (err) {
    if (err) {
        console.error('Failure to launch server');
        return;
    }
    console.log(`SERVER Listening on port ${config.serverPort}`);
  });

// routes
require( "./server/routes/index.js" )( app );