const express = require('express');
const {signUp} = require('../../controllers/user.controller');
const router = express.Router();

router.route('')
    .post(signUp);

module.exports = router;
