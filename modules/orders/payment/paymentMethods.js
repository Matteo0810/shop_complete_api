const paypal = require('./methods/paypal');

module.exports = {

    paypal: {
        name: "PayPal",
        callback: async (paymentData) =>
            (await paypal.createPayment(paymentData))[1].href,
        order: async ({ paymentId, token, PayerID }, paymentData) => {
            if(!paymentId || !token || !PayerID)
                return ["Some parameters are not found.", 404]
            const payment = await paypal.getPayment(paymentId);
            if(!payment)
                return ["Payment not found", 404]
            if(payment.state === 'approved')
                return ["Payment has already approved", 403]
            const diff = Date.now() - new Date(payment.create_time).getTime()
            if(diff/1000/60/60 >= 5) //5 minutes
                return ["Time has expired", 403]
            const result = await paypal.confirmPayment(paymentId, PayerID, paymentData.total);
            if(!result)
                return ["Internal server error when confirmation has operated... Please retry", 500]
            return paymentData
        }
    },

    blue_card: {
        name: "Carte Bleue",
        callback: () => {

        },
        order: async (query, paymentData) => {

        }
    }

}