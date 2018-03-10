const sequelize = require('../db/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    }
}, {
    timestamps: false
});

// Hashing password

User.beforeCreate((user, options, done) => {
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
            return console.log('an error occured trying to hash given password', err);
        };
        user.password = hash;
        done();
    });
});

// Instance Methods

User.prototype.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens = [{access, token}];

    return user.save().then(() => {
        return token;
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