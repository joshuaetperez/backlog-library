const {body} = require('express-validator');
const {checkEmailNotVerified} = require('../helpers');

const reverifySchema = [
  body('email')
    .exists()
    .isEmail()
    .withMessage('Email must be a valid email address')
    .custom(async (value) => {
      if (!(await checkEmailNotVerified(value))) {
        throw new Error(
          'Email address is either already verified or is not registered to an account'
        );
      }
    }),
];

module.exports = reverifySchema;
