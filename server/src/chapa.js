const axios = require('axios');


require('dotenv').config();

const myHeaders = new Headers(); myHeaders.append("Authorization", `Bearer ${process.env.CHAPA_API_KEY}`); myHeaders.append("Content-Type", "application/json");





const initializePayment = async ({
    uid,
    phone,
    email,

}) => {
    const paymentDetails = {
        amount: 100,
        currency: 'ETB',
        email: email,
        phone_number: phone,
        tx_ref: 'txn-' + uid+'-'+Date.now(),
        redirect_url: 'http://your-server/callback',
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
   
    try {
        const response = await axios.get(`https://api.chapa.co/v1/verify/${tx_ref}`, {
            headers: {
                'Authorization': 'Bearer ' + process.env.CHAPA_API_KEY,
            }
        });

        return response.data.status === 'success';
    } catch (error) {
        throw new Error('Error verifying payment: ' + error.message);
    }
};

module.exports = { initializePayment, verifyPayment };
