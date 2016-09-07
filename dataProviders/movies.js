'use strict';
var request = require('request');
var _ = require('underscore');
var config = require('../config/config');

exports.get = function(callback)
{
  var movieData = {results:[]};

  for(var i=1; i<=10; i++)
  {
    (function(pageNo){
      request(config.dataApi.movies + 'page=' + pageNo, function(err, resp, data){
        if(data.error) return callback(err, []);
        var obj = JSON.parse(data);
        movieData.results = movieData.results.concat(obj.results);
        if(pageNo == 10)
       {
          callback(null, movieData.results);
        }
      });

    })(i);
  }

}
