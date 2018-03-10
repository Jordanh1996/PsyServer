var express = require('express');

const controller = require('./register.controller');
const {allowCors} = require('../../middleware/authenticate');

var router = express.Router();

router.post('/', allowCors, controller.Register);

router.get('/:username', allowCors, controller.UserCheck);

module.exports = router;