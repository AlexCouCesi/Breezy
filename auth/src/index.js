const express = require('express')
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));// parse requests of content-type - application/x-www-form-urlencoded

require("dotenv").config();
require('./routes/auth.routes')(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
