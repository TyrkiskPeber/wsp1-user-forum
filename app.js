require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const nunjucks = require('nunjucks');
var session = require('express-session')

const indexRouter = require('./routes/index');

const app = express();

app.use(session({       //Sessionens inställningar
    secret: "tomatosaucetomatosaucetomboysupremacytomatosaucetomatosauce",
    saveUninitialized:true,
    resave: false
}));

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;