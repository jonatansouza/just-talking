var express = require('express'),
    load = require('express-load'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors'),
    passport = require('passport'),
    flash = require('connect-flash'),
    session = require('express-session');

module.exports = function() {
    var app = express();
    app.use(morgan('dev'));
    app.use(cors());

    app.use(express.static('./public'));
    app.set('view engine', 'ejs');
    app.set('views', './app/views');

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    //for error login messages
    app.use(flash());

    app.use(bodyParser.json());
    app.use(require('method-override')());

    app.use(session({
        secret: 'secret @_app',
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    load('models', {
            cwd: 'app'
        })
        .then('controllers')
        .then('routes')
        .into(app);

    return app;
};
