const { Router } = require('express'),
    Items = require('./Items'),
    router = Router();

router.get('/all', async (request, response) => {
    const { query } = request;
    return response.status(200)
        .json(await Items.getAll(
            query.hasOwnProperty('search') ? { name: query.search } : null,
            query.hasOwnProperty('sort') ? { [query.sort]: -1 } : null
        ))
})

// TODO FILTER DIDN'T DONE
router.get('/filter', async (request, response) => {
    const { query } = request;
})

// ITEM INTERACTIONS

router.get('/:id', async (request, response) => {
    const { id } = request.params;
    return response.status(200)
        .json(await Items.get({ _id: id }))
})

router.post('/add', async (request, response) => {
    const data = request.body;
    if(!data || (!data.name || !data.description ||
        !data.added_date || !data.code ||
        !data.brand || !data.price ||
        !data.quantity || !data.previews ||
    !data.characteristics))
        return response.status(503).send("Invalid form body");
    const result = await Items.add(data);
    if(result instanceof Array)
        return response.status(result[1]).send(result[0]);
    return response.status(200).send("Item added !");
})

router.patch('/update', async (request, response) => {
    const { body } = request;
    if(!body._id || !body.data)
        return response.status(503).send('Invalid form body.');
    Items.update(body.data, body._id)
    return response.status(200).send('Item updated !');
})

router.delete('/delete/:id', async (request, response) => {
    const { params } = request;
    if(!params.id)
        return response.status(503).send('Invalid form body.');
    Items.delete({
        _id: params.id
    });
    return response.status(200).send('Item deleted !');
})

module.exports = {
    name: 'items',
    router: router
}