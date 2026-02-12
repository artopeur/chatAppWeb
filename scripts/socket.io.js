const socket = io("http://localhost:3112");

socket.emit("set-username", "Alice");
socket.emit("join-room", "room-1");

socket.on("message", (msg) => {
  console.log(`${msg.from}: ${msg.text}`);
});

socket.emit("message", {
  roomId: "room-1",
  text: "Hello everyone!"
});

