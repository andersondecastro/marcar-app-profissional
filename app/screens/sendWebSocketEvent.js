const { BASE_URL_WS } = require("./config");

module.exports =  sendWebSocketEvent = (eventData) => {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(BASE_URL_WS);

    socket.onopen = () => {
      socket.send(JSON.stringify(eventData));
      socket.close(); 
      resolve();
    };

    socket.onerror = (error) => {
      reject(error);
    };
  });
};
