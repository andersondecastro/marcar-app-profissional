let socket = null;
const { BASE_URL_WS } = require("./config");

const connectWebSocket = async () => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(BASE_URL_WS);

    return new Promise((resolve, reject) => {
      socket.onopen = () => {
        console.log('Conexão WebSocket estabelecida');
        resolve();
      };

      socket.onerror = (error) => {
        console.error('Erro no WebSocket: ', error);
        reject(error);
      };

      socket.onclose = (event) => {
        if (!event.wasClean) {
          console.error('Conexão WebSocket encerrada de forma inesperada');
        }
        socket = null;
      };
    });
  } else if (socket.readyState === WebSocket.OPEN) {
    return Promise.resolve(); 
  }
};

const sendWebSocketEvent = async (eventData) => {
  try {
    console.log('|| PRONTO PARA ENVIAR DADOS ||\n');
    
    await connectWebSocket(); 

    console.log("-> Enviando para servidor ws............");
    socket.send(JSON.stringify(eventData)); 
    
  } catch (error) {
    console.error("Erro ao enviar evento WebSocket: ", error);
    throw error; 
  }
};

module.exports = sendWebSocketEvent;
