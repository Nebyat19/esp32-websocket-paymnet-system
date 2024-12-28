const WebSocket = require('ws');
const { initiatePayment } = require('./payment');

let wsClients = {};
let wss = null
const initWebSocket = (server) => {

    wss = new WebSocket.Server({ server });
    wss.on('connection', (ws) => {
        console.log('Client connected');

        ws.on('message', async (message) => {
            console.log('Received message:', message);

            // Check if the message is a valid UID (you can improve this by validating the UID format)
            if (message) { // Assuming UID is a 12-character string
                try {
                    const email = 'user@example.com'; // You can add logic here to fetch the email
                    const phone = '+1234567890'; // Similarly, fetch the phone number

                    // Initiate payment
                    const paymentLink = await initiatePayment(message, email, phone);


                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({ type: 'checkout', url: paymentLink }));
                        }
                    });

                } catch (error) {
                    console.error("Error during payment initiation:", error);
                    ws.send(JSON.stringify({ status: 'Error', message: 'Failed to initiate payment' }));
                }
            } else {
                console.log('Invalid UID format:', message);
                ws.send(JSON.stringify({ status: 'Error', message: 'Invalid UID format' }));
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    });
};

const notifyALL = () => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'payment-complete' }));
            console.log("notifyALL")
        }
    });
};

module.exports = { initWebSocket, notifyALL };
