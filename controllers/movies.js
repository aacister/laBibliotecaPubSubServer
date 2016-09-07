'use strict';

var movies = require('../models/movies');
var _ = require('underscore');

/*Save movies*/
exports.save = function(req, res, next) {
  var movieList = _.clone(req.body);
  movies.save(movieList, function(err, data){
    if (err) return res.send(503, err);

    next();
  });
};

/*Trim movies*/
exports.trim = function(req, res, next) {
  movies.trim();
  next();
};

/*Send movies*/
exports.send = function(req, res, next) {
  var movieList = _.clone(req.body);
  movies.send(movieList);
  res.status(200);
};

/*Get movies*/
exports.get = function(req, res, next) {
  movies.get(function(err, data){
    res.json(err ? 503 : 200, {
      error: err ? true : null,
      errorMessage: err ? err : null,
      data: data
    });
  });
};
