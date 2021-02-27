const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Set email for contact'],
      unique: true,
    },
    phone: {
      type: String,
      match: /^\+?[(]?[0-9]{2,4}[)]?\s?-?[0-9]{2,3}-?[0-9]{1,3}-?[0-9]{1,3}-?[0-9]{1,3}$/,
      required: [true, 'Set phone for contact'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      required: [true, 'Set subscription for contact'],
    },
    password: {
      type: String,
      minLength: 6,
      maxLength: 50,
      required: [true, 'Set password for contact'],
    },
    token: {
      type: String,
      default: '',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Contact = model('contact', contactSchema);

module.exports = Contact;
