var express = require('express');
var router = express.Router();

var msgStorage = [{message:"a"}, {message:"b"}, {message:"c"}];


var webApp = (
  router.get('/', function(req, res, next) {
    //console.log(req);
    res.json({message: "Hello World"});
    console.log("Main route hit");
  },
  router.post('/message', function(req, res, next) {
    console.log(req.body);
    msgStorage.push(req.body);
    res.json({message: "Message received"});
    console.log("Message route hit");
  }),
  router.get('/messages', function(req, res, next) {
    res.json(msgStorage);
    console.log("Messages route hit");
  })
  
));

module.exports = webApp;