const { Router } = require('express'),
    Users = require('./Users'),
    router = Router();


router.post('/create', async (request, response) => {
    const data = request.body;
    if(!data || (!data.name || !data.firstname || !data.email || !data.password || !data.birthday))
        return response.status(503).send("Invalid form body");
    const result = await Users.create(data);
    if(result instanceof Array)
        return response.status(result[1]).send(result[0]);
    return response.status(200).send(Users.generateAuthorization(result));
})

router.post('/login', async (request, response) => {
    const data = request.body;
    if(!data || (!data.email || !data.password))
        return response.status(503).send("Invalid form body");
    const result = await Users.login(data.email, data.password);
    if(result instanceof Array)
        return response.status(result[1]).send(result[0])
    return response.status(200).send(Users.generateAuthorization(result));
})

// USER INTERACTIONS

router.get('/get', async (request, response) => {
    const result = await Users.hasAuthorization(request.headers.authorization);
    if(result instanceof Array)
        return response.status(result[1]).send(result[0])
    return response.status(200).json(result)
})

router.patch('/update', async (request, response) => {
    const result = await Users.hasAuthorization(request.headers.authorization);
    if(result instanceof Array)
        return response.status(result[1]).send(result[0])
    Users.update({ _id: result._id }, request.params.data)
    return response.status(200).send('User updated !');
})

router.delete('/delete', async (request, response) => {
    const result = await Users.hasAuthorization(request.headers.authorization);
    if(result instanceof Array)
        return response.status(result[1]).send(result[0])
    Users.delete({ _id: result._id })
    return response.status(200).send('User deleted !');
})

module.exports = {
    name: 'user',
    router: router
}