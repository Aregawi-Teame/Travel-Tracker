const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');

router.route('')
    .post(userController.addUser);

    
module.exports = router;