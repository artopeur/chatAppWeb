const { Server } = require("socket.io");
const messageStore = require("../models/messageStore");
const database = require("../models/database");
const saveToDatabase = true;

function initChatSocket(server) {
  const io = new Server(server, {
    path: "/socket.io",
    transports: ["polling", "websocket"],
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // store username on this socket
    socket.on("set-username", (username) => {
      socket.username = username;
      console.log(`${socket.id} set username: ${username}`);
    });

    socket.on("join-room", (roomId) => {
      
      // join room with id
      socket.join(roomId);
      console.log(`${socket.username || socket.id} joined ${roomId}`);
      // reload twenty last messages.
      if(saveToDatabase) {
        let sql = `SELECT * FROM chats WHERE room=? ORDER BY id DESC`;
        database.query(sql,[roomId], function(error, response) {
          if(error) {
              console.log(error);
          }
          else {
            response.reverse().forEach( element => {
              console.log(`${element.sender_id}:${element.created_at} ${element.sender}: ${element.room}: ${element.message}`);
              let msg = {
                from: element.sender || element.sender_id,
                text: element.message,
                timestamp: element.create_at
              };
              //io.to(roomId).emit("message", msg);
              socket.emit("message", msg);
            });
           
            
          }
        });
      }
      
      
    });
    // read message, populate message
    socket.on("message", ({ roomId, text }) => {
      const message = {
        from: socket.username || socket.id,
        text,
        timestamp: Date.now()
      };

      
      // adding new message to messageStore
      messageStore.add(roomId, message);

      // There is a method to get the last twenty messages from all rooms, that can be read from the console on the website.
      // Used when no room is selected / first load.
      // store message in history : Still need to add rooms to database and select them by room on entry.
      if(saveToDatabase) {
          let sql = `INSERT INTO chats(sender, room, message) VALUES('${socket.username}', '${roomId}', '${message.text}')`;
          database.query(sql, function(error, response) {
          if(error) {
            console.log(error);
          }
          else {
            console.log(`'${socket.username}' sent a message: '${message.text}' that was saved to database.`);
          }
        });
      }
      

      // broadcast message to room
      io.to(roomId).emit("message", message);
    });
    // Implementation of left room message still missing.
    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.username || socket.id);
      const message = {
        from: socket.username || socket.id,
        text:  " has left the room",
        timestamp: Date.now()
      }
      io.to(roomid).emit("message", message);
    });
    socket.on("leave-room", (roomid, user) => {
      const message = {
        from: user || socket.id,
        text: " has left the room",
        timestamp: Date.now()
      }
      io.to(roomid).emit("message", message);
    });
  });
}

module.exports = initChatSocket;
