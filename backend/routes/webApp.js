var express = require('express');
var router = express.Router();
var messageStore = require('../models/messageStore');
const database = require('../models/database');
//const env = require('dotenv');


//console.log("ENV:", process.env.MYSQL_HOST);
//console.log("POOL QUERY:", typeof database.query);

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


router.post('/chats', function(req, res) {
    console.log("function start");

    let sql = "Insert into chats(user_id, message) VALUES(1,'this one.')";
    database.query(sql, function(error, result){
        if(error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
        console.log(result);
        return res.json(result);
    });
});
router.get('/chats', function(req, res) {
	console.log("function start");

	let sql = "Select * from chats order by created_at DESC LIMIT 20";
	database.query(sql, function(error,result) {
	    if(error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	    }
            console.log(result);
            return res.json(result);
        });
});

module.exports = router;
