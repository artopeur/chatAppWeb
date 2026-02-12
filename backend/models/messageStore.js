const messagesByRoom = {};

function add(roomId, message) {
  if (!messagesByRoom[roomId]) {
    messagesByRoom[roomId] = [];
  }
  messagesByRoom[roomId].push(message);
}

function list(roomId) {
  return messagesByRoom[roomId] || [];
}

module.exports = { add, list };