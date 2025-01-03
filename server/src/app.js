require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { initWebSocket, notifyALL, notifyPayemtProcess, sendMessagetoClient } = require('./websocket');
const { startPayment, verifyPayment } = require('./chapa');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("webhook is working");
}
)


// Route for handling /callback
app.get('/callback', async (req, res) => {
    const { trx_ref, status } = req.body;

    notifyPayemtProcess()
    try {
        const result = await verifyPayment(trx_ref);

        notifyALL();
        return res.status(200).send("Payment successful, gate opening...");


    } catch (error) {
        sendMessagetoClient({ type: "payment-failed", text: error.message })
        return res.status(500).send(error.message);
    }
});

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Initialize WebSocket for ESP32 communication
initWebSocket(server);
