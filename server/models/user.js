const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const sequelize = require('../db/database');

const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            len: {
                args: [6,32],
                msg: "String length is not in this range"
           }
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6,32],
                msg: "String length is not in this range"
           }
        }
    },
    token: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    timestamps: false
});

// Hashing password

User.beforeCreate((user, done) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(user.password, 10, (err, hash) => {
            if (err) {
                console.log('an error occured trying to hash given password', err);
                reject();
            };
            user.password = hash;
            resolve();
        });
    })
});

// Instance Methods

User.prototype.generateAuthToken = function () {
    var access = 'auth';
    this.token = jwt.sign({username: this.username, access}, process.env.JWT_SECRET).toString();

    return this.save().then(() => {
        return this.token;
    });
};

User.prototype.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

// Class Methods

User.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return Promise.reject();
    };

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

User.findByCredentials = function (username, password) {
    return this.findOne({username}).then((user) => {
        if (!user) {
            return Promise.reject();
        };
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                };
            });
        });
    });
};

module.exports = User;