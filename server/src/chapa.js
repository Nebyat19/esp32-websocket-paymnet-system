const axios = require('axios');


require('dotenv').config();

const myHeaders = new Headers(); myHeaders.append("Authorization", `Bearer ${process.env.CHAPA_API_KEY}`); myHeaders.append("Content-Type", "application/json");





const initializePayment = async ({
    uid,
    phone,
    email,

}) => {
    const paymentDetails = {
        amount: 1,
        currency: 'ETB',
        email: email,
        phone_number: phone,
        tx_ref: 'txn-' + uid + '-' + Date.now(),
        callback_url: process.env.CALL_BACK_URL,
    }

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(paymentDetails),
        redirect: 'follow'
    };
    try {

        const response = await fetch('https://api.chapa.co/v1/transaction/initialize', requestOptions);
        const result = await response.text();
        const parsedResult = JSON.parse(result);
        if (parsedResult.data) return parsedResult.data.checkout_url
        throw new Error(parsedResult.message)

    } catch (error) {
        throw new Error(error.message);
    }
};

const verifyPayment = async (tx_ref) => {
    let response;
    var raw = ""; var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    try {
        response = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        });

        response = await response.text();
        response = JSON.parse(response)
        if (response.status === 'success') return true;
        else throw new Error(response.message);
    } catch (error) {
        throw new Error('Error verifying payment: ' + error.message);
    }
};

module.exports = { initializePayment, verifyPayment };
