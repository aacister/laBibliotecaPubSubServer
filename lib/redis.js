'use strict';
//heroku config
var port = process.env.REDIS_PORT || 15679 ;
var host = process.env.REDIS_HOST || 'ec2-54-163-236-235.compute-1.amazonaws.com';
var auth = process.env.REDIS_AUTH || 'paj9qn059phcjid8vrh4e0dr823';

//local config
/*
var port = process.env.REDIS_PORT || 6379;
var host = process.env.REDIS_HOST || 'localhost';
var auth = process.env.REDIS_AUTH || null;
*/
var redis = require('redis');
var client = redis.createClient(port, host);
if (auth) client.auth(auth);

client.on('error', function(err){
  throw err;
});

module.exports = client;
