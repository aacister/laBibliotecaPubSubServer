'use strict'

var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');
var express = require('express');
var http = require('http');
var fs = require('fs');
var request = require('request');
var arrandom = require('arrandom');

var config = require('./config/config');

var songs = require('./controllers/songs');
var movies = require('./controllers/movies');

var moviesModel = require('./models/movies');
var songsModel = require('./models/songs');

var moviesProvider = require('./dataProviders/movies');
var songsProvider = require('./dataProviders/songs');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
}

var app = express();
app.use(express.static('public'));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(allowCrossDomain);


var server  = require('http').createServer(app);
var port = process.env.PORT || 8000;
server.on('listening',function(){
    console.log('ok, server is running');
});
server.listen(port, function(){
  console.log('Server running on port %d', port);
});

//Express routes
/* Get most recent songs*/
app.get('/songs', songs.get);

/* Get most recent movies*/
app.get('/movies', movies.get);


app.post('/songs', songs.save, songs.trim, songs.send);

app.post('/movies', movies.save, movies.trim, movies.send);


//Web Sockets
const WebSocketServer = require("ws").Server;
const wsSongServer = new WebSocketServer({ server: server, path: '/songs'});
const wsMovieServer = new WebSocketServer({server: server, path: '/movies'});

var wsSongClients = [];
var wsMovieClients=[];

wsSongServer.on("connection", (ws) => {

  if (ws.readyState === ws.OPEN) {
    wsSongClients.push(ws);
    //grab records in redis initially on connection. Should be 10 records b/c of trim on save from data producer
   songsModel.get(function(err, songList){
    songList.forEach(function(song){
      ws.send(JSON.stringify(song));
    });
  });
}

   ws.on('close', function() {


  });
  ws.on('message', function(data){

    wsSongClients.forEach(function(client){
      client.send(data);
    })

  });


  ws.on('error', function(err){
    console.log(err);
    throw err;
  });

});



wsMovieServer.on("connection", (ws) => {

   if (ws.readyState === ws.OPEN) {
     wsMovieClients.push(ws);

   //grab records in redis initially on connection. Should be 10 records b/c of trim on save from data producer
   moviesModel.get(function(err, movieList){
    movieList.forEach(function(movie){
      ws.send(JSON.stringify(movie));
    });
  });
}

   ws.on('close', function() {

  });
  ws.on('message', function(data){
    wsMovieClients.forEach(function(client){
      client.send(data);
    })

  });


  ws.on('error', function(err){
    console.log(err);
    throw err;
  });


});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.log('Error: ' + err.message);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//Data Producer - Would be moved to different project and server

var movieData = [];
var songData = [];

var requestMovies = {
    json: movieData,
    method: 'POST',
    url: config.webServer + '/movies'
};

var requestSongs = {
    json: songData,
    method: 'POST',
    	url: config.webServer + '/songs'
};


(function _requestSongs() {
    songsProvider.get(function(err, data) {
        (function _requestSongs() {
            requestSongs.json = [arrandom(data)[0]];
            request(requestSongs, function(err) {
                if (err) console.log(err);
                setTimeout(_requestSongs, 4000);
            })
        })();
    });
})();



(function _getMovies() {
    moviesProvider.get(function(err, data) {
        (function _requestMovies() {
            requestMovies.json = [arrandom(data)[0]];
            request(requestMovies, function(err) {
                if (err) console.log(err);
                setTimeout(_requestMovies, 4000);
            });
        })();
    });
})();



module.exports = app;
