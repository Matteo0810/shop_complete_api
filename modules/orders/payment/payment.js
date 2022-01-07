const paymentMethods = require('./paymentMethods'),
    Users = require('../../users/Users');

function paymentRedirection(paymentData) {
    return parsePaymentMethod(paymentData.method).callback(paymentData);
}

async function paymentOrder(authorization, query, data) {
    const { paymentData } = data;
    if(!paymentData)
        return ["Some parameters are not found.", 404]
    const decodedPaymentData = decodePaymentData(paymentData);
    return parsePaymentMethod(decodedPaymentData.method).order(query, decodedPaymentData);
}

function decodePaymentData(paymentData) {
    return JSON.parse(decodeURI(paymentData));
}

function parsePaymentMethod(method) {
    if(paymentMethods.hasOwnProperty(method))
        return paymentMethods[method];
    return console.error('Method not found.')
}

module.exports = { paymentRedirection, paymentOrder }