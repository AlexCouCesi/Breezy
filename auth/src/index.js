const express = require('express')
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));// parse requests of content-type - application/x-www-form-urlencoded

require("dotenv").config();
app.use('/api/auth', require('./routes/auth.routes'));

app.listen(port, () => {
    console.log(`Breezy auth service listening on port ${port}`)
})
