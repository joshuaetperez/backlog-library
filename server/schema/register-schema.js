const {body} = require('express-validator');
const {isEmailInUse} = require('../helpers');

const registerSchema = [
  body('email')
    .exists()
    .isEmail()
    .withMessage('Email must be a valid email address')
    .custom(async (value) => {
      if (await isEmailInUse(value)) {
        throw new Error('Email address is already in use');
      }
    }),
  body('password')
    .exists()
    .isLength({min: 6})
    .withMessage('Password must contain at least 6 characters'),
  body('confirmPassword')
    .exists()
    .isLength({min: 6})
    .withMessage('Confirmation password must contain at least 6 characters')
    .custom((value, {req}) => {
      if (value !== req.body.password) {
        throw new Error('Confirmation password does not match password');
      }
      return true;
    }),
];

module.exports = registerSchema;
