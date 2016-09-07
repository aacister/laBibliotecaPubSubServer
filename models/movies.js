'use strict';

var redis = require('../lib/redis');
var config = require('../config/config');
var WebSocket = require('ws');


/**
 *  Save a message in the db
 *param movies: array
 *param callback: function
 */
exports.save = function(movies, callback) {
  let _movies = movies;
if (movies.length <= 0)
 return callback(null, null);
else {
  var movie = _movies.pop();
  redis.lpush('movies', JSON.stringify(movie), function(err, data){
    if (err) return callback(err, null);
    exports.save(_movies, callback);
  });
}

};

/*Trim down the redis list*/
exports.trim = function() {
  redis.ltrim('movies', 0, 9, function(err){
    if (err) throw err;
  });
};

/*Send movies to the socket*/
/*
exports.send = function(movies) {
  var ws = new WebSocket(config.socketServer + '/movies');
  ws.binaryType = 'arraybuffer';
  ws.onopen = function(){
      movies.forEach(function(movie){
        ws.send(JSON.stringify(movie));
      });
  }
};
*/
exports.send = function(movies) {

  var ws = new WebSocket(config.socketServer + '/movies');
  ws.onopen = function(){
      movies.forEach(function(movie){
        ws.send(JSON.stringify(movie));
      });
  }

};


/*Get movies*/
exports.get = function(callback) {
  redis.lrange('movies', 0, -1, function(err, data){
    if (err) return callback(err, null);
  return callback(null, data.map(JSON.parse));
  });
};
