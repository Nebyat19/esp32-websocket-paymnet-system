const WebSocket = require('ws');

// The URL of your WebSocket server (update with the actual server IP or URL)
const SERVER_URL = 'ws://localhost:8000'; // or use your server's IP

// Create a WebSocket client
const ws = new WebSocket(SERVER_URL);

ws.on('open', () => {
  console.log('Connected to WebSocket server');

  // Simulate the ESP32 sending UID every 5 seconds
  setInterval(() => {
    const uid = '123456'; // Simulate the UID (you can change this for testing)
    console.log(`Sending UID: ${uid}`);
    ws.send(uid);
  }, 5000); // Send UID every 5 seconds
});

ws.on('message', (message) => {
  console.log(`Received message from server: ${message}`);
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err);
});

ws.on('close', () => {
  console.log('Connection closed');
});
