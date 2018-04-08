var bodyParser = require('body-parser');
var config = require('./config/env/env');
var express = require('express');
var http = require('http');
var logger = require('morgan');
var mongodb = require('./config/mongo.db');

var userRoutes_v1 = require('./routes/user.routes.v1');
var postRoutes_v1 = require('./routes/post.routes.v1');
var commentRoutes_v1 = require('./routes/comment.routes.v1');

var app = express();

module.exports = {};

// Set bodyparser
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// Set environmentals
app.set('port', (process.env.PORT || config.env.webPort));
app.set('env', (process.env.ENV || 'development'));

// CORS headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
//set routes
app.use('/api/v1/users', userRoutes_v1);
app.use('/api/v1/posts', postRoutes_v1);
app.use('/api/v1/comments', commentRoutes_v1);


//About response
app.get(['/about',  '/api/v1/about'], function(req, res) {
    res.json({'info' : 'SPA individual Backend'});
});

//Standard error handling
app.use(function (err, req, res, next) {
    var error = {
        message: err.message,
        code: err.code,
        name: err.name,
        status: err.status
    }
    res.status(401).send(error);
});

//Catch all unknown
app.use('*', function (req, res) {
    res.status(400);
    res.json({
        'error': 'URL not found. Please check your URL and try again.'
    });
});

app.listen(config.env.webPort, function () {
    console.log('De server luistert op port ' + app.get('port'));
    console.log('Zie bijvoorbeeld http://localhost:'+ app.get('port') + '/api/v1/someroutes');
});

module.exports = app;