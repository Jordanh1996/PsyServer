require('./config/config');

const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./db/database');
const RegisterRoute = require('./routes/register');

     const User = require('./models/user');

const app = express();
var port = process.env.PORT;

var serverOptions = {
    origin: ['http://localhost:8080'],
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['x-auth', 'Content-Type'],
    exposedHeaders: 'x-auth',
    credentials: true,
    preflightContinue: true
};

app.options('*', cors(serverOptions));

app.use(bodyParser.json());

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
});



User.sync()
// User.create({
//     username: 'ssssssss',
//     password: '123123'
// }).then((res) => {
//     console.log(res)
// })
// User.findAll().then((res) => {
//     console.log(res)
// })
// sequelize.query('SELECT * FROM `users`').then((res) => {
//     console.log(res)
// })

app.use('/register', RegisterRoute);

app.listen(port, () => {
    console.log(`server is up on port ${port}`);
});