const { Router } = require('express'),
    Orders = require('./Orders'),
    Users = require('../users/Users'),
    { paymentRedirection, paymentOrder } = require('./payment/payment'),
    createInvoice = require('./payment/paymentInvoice'),
    router = Router();

router.get('/order/:state', async (request, response) => {
    const { state } = request.params,
        { authorization } = request.headers,
        { paymentData } = request.body,
        result = await Users.hasAuthorization(authorization);

    if(result instanceof Array)
        return response.status(result[1]).send(result[0])
    switch(state) {
        case 'purchase':
            response.status(200).json(await paymentRedirection(paymentData))
            break;
        case 'purchased':
            const result = await paymentOrder(authorization, request.query, paymentData)
            if(result instanceof Array)
                return response.status(result[1]).send(result[0])
            await Orders.create(result);
            await createInvoice(paymentData)
            response.status(200).send('Order purchased !')
            break;
    }
    return response.status(503).send('Invalid form body.')
})

// ORDER INTERACTIONS

router.get('/:user', async (request, response) => {
    return await Orders.getAll({
        user: request.params.user
    });
})

router.patch('/update', async (request, response) => {
    const result = await Users.hasAuthorization(request.headers.authorization),
        { id } = request.params;
    if(result instanceof Array)
        return response.status(result[1]).send(result[0])
    if(!id)
        return response.status(200).send('id parameters are missing.')
    Orders.update({ _id: result._id }, request.params.data)
})

router.delete('/delete/:user/:id', async (request, response) => {
    const { user, id } = request.params;
    if(!user || !id)
        return response.status(200).send('Some parameters are missing.')
    Orders.delete({
        _id: id,
        user: user
    })
})

module.exports = {
    name: 'orders',
    router: router
}