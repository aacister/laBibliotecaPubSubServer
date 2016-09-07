'use strict';

var songs = require('../models/songs');
var _ = require('underscore');

/*Save songs*/
exports.save = function(req, res, next) {
  var songList = _.clone(req.body);
  songs.save(songList, function(err, data){
    if (err) return res.send(503, err);
    next();
  });
};

/*Trim songs*/
exports.trim = function(req, res, next) {
  songs.trim();
  next();
};

/*Send songs*/
exports.send = function(req, res, next) {
  var songList = _.clone(req.body);
  songs.send(songList);
  res.status(200);
};

/*Get songs*/
exports.get = function(req, res, next) {
  songs.get(function(err, data){
    res.json(err ? 503 : 200, {
      error: err ? true : null,
      errorMessage: err ? err : null,
      data: data
    });
  });
};
