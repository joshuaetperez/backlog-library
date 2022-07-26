const {body} = require('express-validator');

const confirmPasswordSchema = [
  body('password')
    .exists()
    .isLength({min: 6})
    .withMessage('Password must contain at least 6 characters'),
];

module.exports = confirmPasswordSchema;
