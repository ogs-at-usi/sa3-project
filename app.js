// require framework and middleware dependencies
const express = require('express');
const path = require('path');
const logger = require('morgan');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const { authenticate } = require('./middlewares/authentication.middleware');

require('dotenv').config();

const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false })); // parse application/x-www.js-form-urlencoded
app.use(express.json({ limit: '4MB' })); // parse application/json
app.use(multer().none()); // parse multipart/form-data
app.use(cookieParser());

app.use(
  express.static(path.join(__dirname, 'public'), { index: 'index.html' })
);

app.set('view engine', 'html');

// TODO - controllers
app.use('/auth', require('./routes/auth'));
app.use('/api', authenticate, require('./routes/chat'));

// serve Vue app if no matching route is found
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

module.exports = app;
