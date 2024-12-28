require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { initWebSocket, notifyALL } = require('./websocket');
const { startPayment, verifyPayment } = require('./chapa');
const { sendPaymentLink } = require('./notifier');
const app = express();

app.use(express.json());
app.get('/', (req, res) => {
    res.send("Welcome to the gate payment system");
}
)
app.get('/callback/:tx_ref/', async (req, res) => {
    const txRef = req.params.tx_ref; // Extract tx_ref from the URL
    try {
        const result = await verifyPayment(txRef);

        notifyALL();
        res.status(200).send("Payment successful, gate opening...");
    } catch (error) {

        return res.status(500).send(error.message);
    }
});

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Initialize WebSocket for ESP32 communication
initWebSocket(server);
