// payment.js
const { initializePayment } = require('./chapa'); // Import Chapa payment integration
const { sendPaymentLink } = require('./notifier'); // Import notification module

// Function to initiate payment
async function initiatePayment(uid, email, phone) {
    if (!uid || !email || !phone) {
        throw new Error("Missing required information");
    }

    try {
        // Start payment with the given UID, email, and phone
        const paymentLink = await initializePayment(uid, email, phone);
        return paymentLink; // Return the payment link to the caller
    } catch (error) {

        throw error;
    }
}

module.exports = { initiatePayment };
