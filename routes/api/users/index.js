const express = require('express');
const router = express.Router();
const validate = require('./validation');
const userController = require('../../../controllers/users');
// const guard = require('../../../helpers/guard');
// const { createAccountLimiter } = require('../../../helpers/rate-limit-reg');

router.post('/auth/register', validate.createUser, userController.register);
router.post('/auth/login', validate.loginUser, userController.login);
router.post('/auth/logout', userController.logout);
router.get('/users/current', userController.getCurrentUser);

module.exports = router;
