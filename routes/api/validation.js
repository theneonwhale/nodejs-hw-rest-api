const Joi = require('joi');

const schemaAddContact = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(
      /^\+?[(]?[0-9]{2,4}[)]?\s?-?[0-9]{2,3}-?[0-9]{1,3}-?[0-9]{1,3}-?[0-9]{1,3}$/,
    )
    .required(),
  password: Joi.string().min(6).max(50).required(),
  subscription: Joi.string().required(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(
      /^\+?[(]?[0-9]{2,4}[)]?\s?-?[0-9]{2,3}-?[0-9]{1,3}-?[0-9]{1,3}-?[0-9]{1,3}$/,
    )
    .optional(),
  password: Joi.string().min(6).max(50).optional(),
  subscription: Joi.string().optional(),
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

module.exports.addContact = (req, res, next) => {
  return validate(schemaAddContact, req.body, next);
};

module.exports.updateContact = (req, res, next) => {
  return validate(schemaUpdateContact, req.body, next);
};
