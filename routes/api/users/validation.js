const Joi = require('joi');

const schemaCreateUser = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
  subscription: Joi.string(),
});

const schemaLoginUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
});

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    const [{ message }] = error.details;
    return next({
      status: 400,
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
