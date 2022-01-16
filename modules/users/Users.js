const Manager = require('../../database/Manager'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt');

module.exports = new class Users extends Manager {

    constructor() {
        super("users", {
            name: String,
            firstname: String,
            email: String,
            password: String,
            birthday: Number,
            created_date: Number,
            addresses: Array,
            permission: Number
        });
    }

    async create(data) {
        const user = await this.get({ email: data.email })
        if(user)
            return ["Email already used.", 403];
        data.password = bcrypt.hashSync(data.password, 10);
        this.insert({
            created_date: Date.now(),
            addresses: [],
            permission: 0,
            ...data,
        });
        return this.get({ email: data.email });
    }

    async login(email, password) {
        const user = await this.get({ email: email })
        if(!user)
            return ["User not found.", 404];
        if(!bcrypt.compareSync(password, user.password))
            return ["Password are not corresponding.", 403];
        return user;
    }

    generateAuthorization({ _id }) {
        return jwt.sign({ _id: _id }, process.env.PRIVATE_KEY)
    }

    async hasAuthorization(authorization) {
        const decoded = jwt.verify(authorization, process.env.PRIVATE_KEY),
            result = await this.get(decoded);
        if(!result)
            return ["User from token was not found.", 404]
        return result
    }

    permissions: {
        ADMIN: 3
    }

}