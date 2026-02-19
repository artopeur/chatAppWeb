
let io_url = "https://chatapp.ydns.eu:3000";
let api_url = "https://chatapp.ydns.eu:3000/api/";
document.addEventListener('DOMContentLoaded', () => {
    
    console.log('document ready');
    const socket = io.connect(io_url, {transports: ["polling", "websocket"]});
    var messages = [];
    var timedEventCounter = 0;
    var intervalTimer = null;
    var enabled = false;
    var saveToDB = true;
    const interval = document.querySelector('#interval');
    const chatInput = document.querySelector('#chatInput');
    const sendButton = document.querySelector('#sendButton');
    const selectRoom = document.querySelector('#roomSelect');
    const roomNameInput = document.querySelector('#roomInput');
    const userNameInput = document.querySelector('#usernameInput');
    const messageList = document.querySelector('#messageList');
    const checkbox = document.querySelector('input[type="checkbox"]');

    // Helper function to escape HTML entities
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    if(saveToDB) {
        // on load
        getData();
    }
    
    // Map of roomId -> roomName
    const roomsById = {};
    // get data() retrieves data drom 
    async function getData() {
    try {
        const res = await fetch(api_url + "chats");

        if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
        }

        const data = await res.json(); // parse JSON body
        console.log(data);

        return data;
    } catch (err) {
        console.error("Failed to get data:", err);
    }
    }
    async function setData(sdr, msg) {
    try {
        const res = await fetch(api_url + "chats", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            sender: sdr,
            message: msg,
        }),
        });

        if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
        }

        const data = await res.json(); // backend response
        console.log("Saved:", data);

        return data;
    } catch (err) {
        console.error("Failed to send data:", err);
    }
    }
    // Fetch rooms from server and populate the room select
    async function loadRooms() {
        try {
            const res = await fetch(api_url + 'rooms');
            const rooms = await res.json();
            // reset options
            selectRoom.innerHTML = '<option value="">Select a room...</option>';
            rooms.forEach(r => {
                const opt = document.createElement('option');
                opt.value = r.id;
                opt.textContent = r.name;
                selectRoom.appendChild(opt);
                roomsById[r.id] = r.name;
            });
            console.log('Loaded rooms:', rooms);
        } catch (err) {
            console.error('Failed to load rooms', err);
        }
    }


  
    // load rooms on startup
    loadRooms();

    console.log(chatInput, sendButton, roomNameInput, userNameInput, checkbox);
    //sendButton.style.backgroundColor = 'blue';

    // Listen for incoming messages from server
    socket.on("message", (msg) => {
        const username = msg.from;
        const timeStr = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : '';
        console.log(`${msg.from}: ${msg.text}`);

        const li = document.createElement('li');
        li.innerHTML = `<div class="message-sender">${escapeHtml(username)} - ${escapeHtml(timeStr)}</div><div class="message-text">${escapeHtml(msg.text)}</div>`;
        if (username === userNameInput.value.trim()) {
            li.classList.add('my-message');
        } else {
            li.classList.add('other-message');
        }
        messageList.appendChild(li);
        scrollToBottom();
    });

    checkbox.addEventListener('change', function() {
        if (this.checked) {
            console.log('Checkbox is checked');
            enabled = true;
        } else {
            console.log('Checkbox is unchecked');
            enabled = false;
        }
    });

    chatInput.addEventListener('keypress', function (e) {

        if (e.key === 'Enter') {
            e.preventDefault();
            console.log("messages length:", messages.length);
            if(enabled) {
                if(messages.length === 0) {
                    let current = messages.length-1;
                    intervalTimer = window.setTimeout(() => timingEvent(current), parseInt(interval.value));
                }
            }
            let message = chatInput.value;
            addMessage(message);
            console.log('chat message', message);
            chatInput.value = '';
        }
    });

    sendButton.addEventListener('click', function (e) {
        e.preventDefault();
        console.log("messages length:", messages.length);
        if(enabled) {
            if(messages.length === 0) {
                intervalTimer = window.setTimeout(() => timingEvent(), parseInt(interval.value));
            }
        }
        let message = chatInput.value;
        console.log('chat message', message);
        addMessage(message);
        socket.emit('chat message', {roomId: selectRoom.value, text: message});
        chatInput.value = '';
    });

    selectRoom.addEventListener('change', function (e) {
        e.preventDefault();

        if(userNameInput.value.trim() === '') {
            alert('Please enter a username before joining a room.');
            selectRoom.value = '';
            return;
        }
        let room = selectRoom.value.trim();
        if(room === '') {
            return;
        }
        let name = userNameInput.value.trim();
        console.log('joining room', room);
        console.log('username', name);
        socket.emit("set-username", name);
        socket.emit("join-room", room);
        socket.emit("message", {roomId: room, text:" has joined the room!"});
        //messageList.innerHTML = '';
    });
    interval.addEventListener('change', function (e) {
        e.preventDefault();
        window.clearTimeout(intervalTimer);
        console.log('setting new interval', parseInt(interval.value));
    });

    function addMessage(msg) {
            const sender = userNameInput.value.trim() || 'me';
            const room = selectRoom.value;
            if (msg === '') return;
            let li = document.createElement('li');
            let timestammp = new Date().toLocaleTimeString();
            li.innerHTML = `<div class="message-sender">${escapeHtml(sender)} - ${escapeHtml(timestammp)}</div><div class="message-text">${escapeHtml(msg)}</div>`;
            li.classList.add('my-message');
            // send to server (timestamp is shown separately in UI)
            if(saveToDB) {
                setData(msg.from, msg.text);
            }
            socket.emit('message', {roomId: room, text: msg});
            if (enabled) {
                let current = messages.length - 1;
                li.style.backgroundColor = 'red';
                window.clearTimeout(intervalTimer);
                intervalTimer = window.setTimeout(() => timingEvent(current), parseInt(interval.value));
            }

            //messageList.appendChild(li);
            scrollToBottom();

    }
    function scrollToBottom() {
        let divMessages = document.querySelector('div#messages');
        divMessages.scrollTop = divMessages.scrollHeight;
        divMessages.nativeScroll = true;
        divMessages.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    function timingEvent(messageid) {
        console.log('timing event. remove first red message if exists');
        const firstRedMessage = messageList.querySelector('li[style*="background-color: red"]');
        if (firstRedMessage) {
            messageList.removeChild(firstRedMessage);
            messages.splice(messageid, 1);
            console.log(messages);
        }
    }
    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
});
