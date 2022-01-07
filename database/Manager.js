const { getCurrentDB } = require('../database/database'),
    { Types, Schema } = require('mongoose');

module.exports = class Manager {

    constructor(name, schema) {
        this.database = getCurrentDB();

        this.name = name
        this.collection = this.database.collection(name);
        this.model = this.database.model(name, this.parseSchema(schema));
    }

    insert(data) {
        return this.collection.insertOne(new this.model(data))
    }

    delete(query) {
        this.model.deleteOne(query, error => {
            if(error)
                return console.error(error);
        });
    }

    get(query) {
        return new Promise(resolve => {
            this.model.find(query).exec((error, data) => {
                if(error)
                    return console.error(error);
                return resolve(!data ? {} : data[0])
            });
        });
    }

    getAll(query = {}, sortedBy = {}) {
        return new Promise(resolve => {
            this.model.find(query).sort(sortedBy).exec((error, data) => {
                if (error)
                    return console.error(error);
                return resolve(data);
            });
        });
    }

    update(query, data) {
        this.model.findOne(query, (error, doc) => {
            if(error)
                return console.error(error);
            for(const key in data) {
                if (data.hasOwnProperty(key))
                    doc[key] = data[key];
            }
            doc.save();
        });
    }

    parseSchema(schema) {
        schema._id = Types.ObjectId;
        return new Schema(schema)
    }

};