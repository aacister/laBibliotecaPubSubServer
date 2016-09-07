'use strict';
var request = require('request');
var _ = require('underscore');
var config = require('../config/config');

exports.get = function(callback)
{
  var songData = {results:[]};

  for(var i=1; i<=2; i+=10)
  {
    (function(startIndex){
      request(config.dataApi.songs + '&offset=' + startIndex, function(err, resp, data){
        if(data.error)
        {
          console.log('Error: ' + data.error);
          return callback(err, []);
        }
        var obj = JSON.parse(data);
        songData.results = songData.results.concat(obj.tracks.items);
        if(startIndex == 1)
        {
          callback(null, songData.results);
        }
      });

    })(i);
  }

}
