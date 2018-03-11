const express = require('express');
const controller = require('./log.controller');

const {allowCors, authenticate} = require('../../middleware/authenticate');

var router = express.Router();

router.post('/in', allowCors, controller.LogIn);

router.post('/register', allowCors, controller.Register);

router.get('/:username', allowCors, controller.UserCheck);

module.exports = router;