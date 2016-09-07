'use strict';

var redis = require('../lib/redis');
var config = require('../config/config');
var WebSocket = require('ws');
/**
 *  Save a message in the db
 *param songs: arrary
 *param callback: function
 */
exports.save = function(songs, callback) {
  let _songs = songs;
  if (songs.length <= 0)
   return callback(null, null);
  else {
    var song = _songs.pop();
    redis.lpush('songs', JSON.stringify(song), function(err, data){
      if (err) return callback(err, null);
      exports.save(_songs, callback);
    });
  }

};

/*Trim down the redis list*/
exports.trim = function() {
  redis.ltrim('songs', 0, 9, function(err){
    if (err) throw err;
  });
};

/*Send songs to the socket*/
/*
exports.send = function(songs) {
  var ws = new WebSocket( config.socketServer + '/songs');
  ws.binaryType = 'arraybuffer';
  ws.onopen = function(){
    console.log('songs socket opened.');
      songs.forEach(function(song){
        ws.send(JSON.stringify(song));
      });
  }
};
*/


exports.send = function(songs) {
  var ws = new WebSocket(config.socketServer + '/songs');
  ws.onopen = function(){
      songs.forEach(function(song){
        ws.send(JSON.stringify(song));
      });
  }

};
/*Get songs*/
exports.get = function(callback) {
  redis.lrange('songs', 0, -1, function(err, data){
    if (err) return callback(err, null);
    return callback(null, data.map(JSON.parse));
  });
};
