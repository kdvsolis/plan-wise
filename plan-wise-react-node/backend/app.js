"use strict"

require('dotenv').config()

const express = require('express');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const handleErrors = require('./middlewares/handle-errors.middleware');
const cors = require('./middlewares/cors.middleware');
const path = require('path');


const port = process.env.PORT || 3000;
const routePath = './routes/';
const app = express();


// Settings
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);

// Load Routes Dynamically
fs.readdirSync(routePath).forEach(function (file) {
  const routeFile = require(routePath + file);
  app.use('/api', routeFile);
});
app.use(handleErrors);

//Load UI static files
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use('/*', express.static(path.join(__dirname, '../frontend//build')));

app.listen(port, function() {
  console.log("The server is listening in port: " + port)
})

module.exports = app;
