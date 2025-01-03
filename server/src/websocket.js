const WebSocket = require('ws');
const { initiatePayment } = require('./payment');


let wsClients = {};
let wss = null
const User = {
    email: 'user@example.com',
    phone: '+1234567890'
}
const initWebSocket = (server) => {

    wss = new WebSocket.Server({ server });
    wss.on('connection', (ws) => {
        console.log('Client connected');

        ws.on('message', async (UID) => {
            console.log('Received message:', UID.toString());

            // Check if the message is a valid UID (you can improve this by validating the UID format)
            if (UID) { // Assuming UID is a 12-character string
                try {


                    // Initiate payment
                    const paymentLink = await initiatePayment(UID.toString(), User.email, User.phone);


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
const notifyPayemtProcess = () => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'payment-processing' }));
        }
    });
}
const notifyALL = () => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'payment-complete' }));
            console.log("notifyALL")
        }
    });
};

const sendMessagetoClient = ({type,text}) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type, text }));
        }
    });
};


module.exports = { initWebSocket, notifyALL, notifyPayemtProcess, sendMessagetoClient };

