require('./config/config');

const express = require('express');
const sequelize = require('./db/database');
const Sequelize = require('sequelize');

const app = express();
var port = process.env.PORT;

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
});



// User.sync()
// User.create({
//     username: 'ssssss',
//     password: '123123'
// }).then(() => {
//     console.log('Instance has been added')
// })
// User.findAll().then((res) => {
//     console.log(res)
// })
sequelize.query('SELECT * FROM `users`').then((res) => {
    console.log(res)
})

app.listen(port, () => {
    console.log(`server is up on port ${port}`);
});