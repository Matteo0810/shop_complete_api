const Manager = require('../../database/Manager');

module.exports = new class Items extends Manager {

    constructor() {
        super("items", {
            name: String,
            description: String,
            added_date: Number,
            code: String,
            brand: String,
            price: Number,
            quantity: Number,
            previews: Array,
            characteristics: Array
        });
    }

    async add(data) {
        const item = await this.get({ name: data.name })
        if(item)
            return ["Name already used.", 403];
        this.insert({
            added_date: Date.now(),
            ...data
        })
        return this.get({ name: data.name })
    }

}