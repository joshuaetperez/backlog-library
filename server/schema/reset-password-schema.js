const {body} = require('express-validator');

const resetPasswordSchema = [
  body('newPassword')
    .exists()
    .isLength({min: 6})
    .withMessage('New password must contain at least 6 characters'),
  body('confirmationPassword')
    .exists()
    .isLength({min: 6})
    .withMessage('Confirmation password must contain at least 6 characters')
    .custom((value, {req}) => {
      if (value !== req.body.newPassword) {
        throw new Error('Confirmation password does not match new password');
      }
      return true;
    }),
];

module.exports = resetPasswordSchema;
