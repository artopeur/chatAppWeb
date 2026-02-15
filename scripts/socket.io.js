let server = "/socket-io"
document.addEventListener('DOMContentLoaded', function () {
    const socket = io(server);
    const messageList = document.querySelector('#messageList');

    socket.emit("set-username", "chatbot1");
    socket.emit("join-room", "room1");

    socket.emit("set-username", "chatbot2");
    socket.emit("join-room", "room2");

    socket.emit("set-username", "chatbot3");
    socket.emit("join-room", "room3");

    socket.on("message", (msg) => {
        console.log(`${msg.from}: ${msg.text}`);
        const li = document.createElement('li');
        li.textContent = `${msg.from}: ${msg.text}`;
        messageList.appendChild(li);
    });
    socket.emit("message", {
        roomId: document.querySelector('#roomSelect').value.trim(),
        text: document.querySelector('#usernameInput').value.trim() + " has joined the room!"
    });
});
