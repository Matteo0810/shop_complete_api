const paypal = require('paypal-node-sdk'),
    { paypal_settings } = require('../paymentMethodsConfig'),
    { mode, client_id, client_secret, return_url, cancel_url } = paypal_settings;

paypal.configure({
    mode: mode,
    client_id: client_id,
    client_secret: client_secret
})

function createPayment(paymentData) {
    return new Promise(resolve => {
        paypal.payment.create(getJSONTemplate(paymentData), (error, { links }) => {
            if(error)
                return console.error(error)
            return resolve(links)
        })
    })
}

function getPayment(id) {
    return new Promise(resolve => {
        paypal.payment.get(id, (error, payment) => {
            if(error)
                return console.error(error)
            return resolve(payment)
        })
    })
}

function confirmPayment(paymentId, payerID, total) {
    return new Promise(async resolve => {
        await paypal.payment.execute(paymentId, {
            "payer_id": payerID,
            "transactions": [{
                "amount": {
                    "currency": "EUR",
                    "total": total
                }
            }]
        }, (error, payment) => {
            if (error)
                return console.error(error)
            return resolve(payment)
        })
    })
}

function parseItems(items) {
    return items.map(({ data, quantity }) => {
        return {
            "name": data.name,
            "sku": data.name,
            "price": data.price.toString(),
            "currency": "EUR",
            "quantity": quantity.toString()
        }
    })
}

function getJSONTemplate(paymentData) {
    return {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "transactions": [{
            "amount": {
                "total": paymentData.total,
                "currency": "EUR",
            },
            "description": `Paiement avec paypal sur le site ${process.env.NAME}.`,
            "payment_options": {
                "allowed_payment_method": "INSTANT_FUNDING_SOURCE"
            },
            "item_list": {
                "items": parseItems(paymentData.items)
            }
        }],
        "note_to_payer": `Merci d'avoir fait confiance à ${process.env.NAME}.`,
        "redirect_urls": {
            "return_url": `${return_url}?method=paypal?paymentData=${encodeURI(JSON.stringify(paymentData))}`,
            "cancel_url": cancel_url
        }
    }
}

module.exports = { createPayment, getPayment, confirmPayment }