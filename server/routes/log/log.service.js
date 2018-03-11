const User = require('../../models/user');

const createUser = (username, password) => {
    return User.create({
        username,
        password
    });
};

const findUsername = (username) => {
    return User.findOne({
        attributes: [
            'username'
        ],
        where: {
            username
        }
    });
};

module.exports = {
    createUser,
    findUsername
};