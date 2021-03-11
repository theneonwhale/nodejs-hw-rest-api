const express = require('express');
const router = express.Router();
const validate = require('./validation');
const userController = require('../../../controllers/users');
const guard = require('../../../helpers/guard');
const upload = require('../../../helpers/upload');

const { createAccountLimiter } = require('../../../helpers/rate-limit-reg');

router.post(
  '/auth/register',
  createAccountLimiter,
  validate.createUser,
  userController.register,
);
router.post('/auth/login', validate.loginUser, userController.login);
router.post('/auth/logout', guard, userController.logout);
router.get('/current', guard, userController.getCurrentUser);
router.patch('/', guard, validate.updateUserSub, userController.updateUserSub);
router.patch(
  '/avatars',
  [guard, upload.single('avatar')],
  userController.avatars,
);
module.exports = router;
