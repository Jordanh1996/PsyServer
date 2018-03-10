const Service = require('./register.service');
const _ = require('lodash');

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
    Register,
    UserCheck
};