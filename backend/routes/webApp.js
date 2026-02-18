var express = require('express');
var router = express.Router();
var messageStore = require('../models/messageStore');
const db = require('../models/database');


const rooms = [
  { id: "room1", name: "General" },
  { id: "room2", name: "Tech" },
  { id: "room3", name: "class" }
];

router.get('/rooms', function (req, res) {
  res.json(rooms);
});

router.get('/', function(req, res) {
  res.json({message: "API running"});
  console.log("Main route hit");
});

router.get('/messages', function(req, res, next) {
  const roomId = req.query.roomId;

  if (!roomId) {
    return res.status(400).json({ error: "roomId required" });
  }

  res.json(messageStore.list(roomId));
});

router.get('/chats', function(req,res) {
  let data = db.query("SELECT * FROM chats ORDER BY id DESC LIMIT 20", function(error, result) {
    if(error) {
      req.json(error);
    }
    else {
      req.json(result);
    }
  });
  console.log(data);
});



module.exports = router;