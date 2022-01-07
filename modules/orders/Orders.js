const Manager = require('../../database/Manager'),
    { Types } = require('mongoose');

module.exports = new class Orders extends Manager {

    constructor() {
        super("orders", {
            user: Types.ObjectId,
            payment: String,
            address: Object,
            ordered_date: Number,
            delivery_date: Number,
            items: Array,
            total: Number,
            state: String,
            invoice: String
        });
    }

    states = {
        ORDERED: 'Commandé',
        IN_COURSE: 'En cours de livraison',
        DELIVERED: 'Délivrée'
    }

    async create(data) {
        return this.insert({
            ordered_date: Date.now(),
            state: this.states.ORDERED,
            ...data
        })
    }

}