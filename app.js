const express = require('express'),
    app = express();

require('dotenv').config();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

require('./database/database').load();
require('./modules/modulesLoader').load(app)
    .catch(console.error);

app.listen(process.env.PORT, error => {
    if(error)
        return console.error(error);
    return console.log(`Server listening with port ${process.env.PORT}.`);
})