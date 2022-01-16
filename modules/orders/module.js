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

router.get('/', async (request, response) => {
    const result = await Users.hasAuthorization(request.headers.authorization);
    if(result instanceof Array)
        return response.status(result[1]).send(result[0])
    return response.status(200).json(await Orders.getAll({
        user: result._id
    }));
})

router.patch('/update', async (request, response) => {
    const result = await Users.hasAuthorization(request.headers.authorization),
        { id } = request.params;
    if(result instanceof Array)
        return response.status(result[1]).send(result[0])
    if(!id)
        return response.status(200).send('id parameters are missing.')
    if(result.permission === Users.permissions.ADMIN)
        return response.status(403).send('Invalid permission')
    Orders.update({ _id: result._id }, request.params.data)
    return response.status(200).send('Order updated !')
})

router.delete('/delete/:user/:id', async (request, response) => {
    const { user, id } = request.params,
        result = await Users.hasAuthorization(request.headers.authorization);
    if(!user || !id)
        return response.status(200).send('Some parameters are missing.')
    if(result instanceof Array)
        return response.status(result[1]).send(result[0])
    if(result.permission === Users.permissions.ADMIN)
        return response.status(403).send('Invalid permission')
    Orders.delete({ _id: id, user: user })
    return response.status(200).send('Order deleted !')
})

module.exports = {
    name: 'orders',
    router: router
}