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
      socket.join(roomId);
      console.log(`${socket.username || socket.id} joined ${roomId}`);
      // reload twenty last messages.
    });

    socket.on("message", ({ roomId, text }) => {
      const message = {
        from: socket.username || socket.id,
        text,
        timestamp: Date.now()
      };

      // store message in history : Still need to add rooms to database and select them by room on entry.
      // There is a method to get the last twenty messages, that can be read from the console.
      messageStore.add(roomId, message);
      if(saveToDatabase) {
          let sql = `INSERT INTO chats(sender, message) VALUES('${socket.username}', '${message.text}')`;
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

    socket.on("disconnect", () => {
      const text = `${socket.username} has left the room.`
      const message = {
        from: socket.username || socket.id,
        text,
        timestamp: Date.now()
      };
      console.log("Disconnected:", socket.username || socket.id);
      io.to(roomId).emit("message", message)
    });
  });
}

module.exports = initChatSocket;
