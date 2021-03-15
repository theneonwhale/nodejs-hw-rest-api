const Joi = require('joi');
const { HttpCode } = require('../../../helpers/constants');

const schemaCreateUser = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
  subscription: Joi.string().optional(),
});

const schemaLoginUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
});

const schemaUpdateUserSub = Joi.object({
  subscription: Joi.string().required(),
});

const uploadAvatar = (req, res, next) => {
  if (!req.file) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      data: 'Bad request',
      message: 'Avatar field with file not found',
    });
  }
  next();
};

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `Failed: ${message.replace(/"/g, '')}`,
    });
  }
  next();
};

module.exports.createUser = (req, res, next) => {
  return validate(schemaCreateUser, req.body, next);
};

module.exports.loginUser = (req, res, next) => {
  return validate(schemaLoginUser, req.body, next);
};

module.exports.updateUserSub = (req, res, next) => {
  return validate(schemaUpdateUserSub, req.body, next);
};

module.exports.uploadAvatar = uploadAvatar;
