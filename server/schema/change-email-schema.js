const {body} = require('express-validator');
const {checkEmailVerification} = require('../helpers');

const changeEmailSchema = [
  body('newEmail')
    .exists()
    .isEmail()
    .withMessage('Email must be a valid email address')
    .custom(async (value) => {
      if (!(await checkEmailVerification(value))) {
        throw new Error(
          'Email address is either not verified or is not registered to an account'
        );
      }
    }),
];

module.exports = changeEmailSchema;
