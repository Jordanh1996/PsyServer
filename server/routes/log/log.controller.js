const _ = require('lodash');
const User = require('../../models/user');
const Service = require('./log.service');

const LogIn = (req, res) => {
    const body = _.pick(req.body, ['username', 'password']);
    User.findByCredentials(body.username, body.password)
    .then((user) => {
        user.generateAuthToken()
        .then((token) => {
            res.header('x-auth', token).send();
        });
    }).catch((e) => {
        res.status(404).send();
    });
};

const Register = (req, res) => {
    const body = _.pick(req.body, ['username', 'password']);
    Service.createUser(body.username, body.password)
    .then((user) => {
        user.generateAuthToken()
        .then((token) => {
            res.header('x-auth', token).send();
        })
    }).catch((e) => {
        console.log(e)
        res.status(400).send();
    });
};

const UserCheck = (req, res) => {
    Service.findUsername(req.params.username)
    .then((username) => {
        if (!username) {
            return res.send({
                taken: 'false'
            })
        };
        res.send({
            taken: 'true'
        });
    });
};

module.exports = {
    LogIn,
    Register,
    UserCheck,
};