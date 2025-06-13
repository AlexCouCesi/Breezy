const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.json());
app.use('/api/tasks', require('./routes/tasks.routes.js'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

mongoose
    .connect("mongodb://"+process.env.MONGO_HOST+":"+process.env.MONGO_PORT+"/"+process.env.MONGO_DATABASE_NAME)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    })
    .catch(err => {
        console.log(err);
    });