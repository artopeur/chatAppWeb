const { Server } = require("socket.io");
const messageStore = require("../models/messageStore");
const database = require("../models/database");


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
    });

    socket.on("message", ({ roomId, text }) => {
      const message = {
        from: socket.username || socket.id,
        text,
        timestamp: Date.now()
      };

      // store message in history
      messageStore.add(roomId, message);
      let sql = `INSERT INTO chats(sender, message) VALUES(${socket.username}, ${socket.message})`;
      database.query(sql, function(error, response) {
        if(error) {
          console.log(error);
        }
        else {
          console.log(`'${socket.username}' sent a message: '${message.text}' that was saved to database.`);
        }
      });

      // broadcast message to room
      io.to(roomId).emit("message", message);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.username || socket.id);
    });
  });
}

module.exports = initChatSocket;
