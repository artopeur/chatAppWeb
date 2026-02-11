document.addEventListener('DOMContentLoaded', () => {
    
    console.log('document ready');
    var messages = [];
    var timedEventCounter = 0;
    var intervalTimer = null;
    var enabled = false;
    const interval = document.querySelector('#interval');
    const chatInput = document.querySelector('#chatInput');
    const sendButton = document.querySelector('#sendButton');
    const selectRoom = document.querySelector('#roomSelect');
    const roomNameInput = document.querySelector('#roomInput');
    const userNameInput = document.querySelector('#usernameInput');
    const messageList = document.querySelector('#messageList');
    const checkbox = document.querySelector('input[type="checkbox"]');

    console.log(chatInput, sendButton, roomNameInput, userNameInput, checkbox);
    //sendButton.style.backgroundColor = 'blue';
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
        //socket.emit('chat message', message);
        chatInput.value = '';
    });

    selectRoom.addEventListener('change', function (e) {
        e.preventDefault();
        let room = selectRoom.value.trim();
        if(userNameInput.value.trim() === '') {
            alert('Please enter a username before joining a room.');
            selectRoom.value = '';
            return;
        }
        if(room === '') {
             
            return;
        }
        let name = userNameInput.value.trim();
        console.log('joining room', room);
        console.log('username', name);
        //socket.emit('join room', roomName);
    });
    interval.addEventListener('change', function (e) {
        e.preventDefault();
        window.clearTimeout(intervalTimer);
        console.log('setting new interval', parseInt(interval.value));
    });

    function addMessage(msg, sender = 'me', timestammp = new Date().toLocaleTimeString()) {
            
            if(msg === '') return;
            let li = document.createElement('li');
            li.textContent = timestammp + ": " + sender + ": " + msg;
            messages.push(msg);
            if(enabled) {
                let current = messages.length - 1;
                li.style.backgroundColor = 'red';
                window.clearTimeout(intervalTimer);
                intervalTimer = window.setTimeout(() => timingEvent(current), parseInt(interval.value));
            }
            
            let divMessages = document.querySelector('div#messages');
            messageList.appendChild(li);
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
