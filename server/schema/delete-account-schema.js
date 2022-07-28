const {param} = require('express-validator');

const deleteAccountSchema = [
  param('userID')
    .exists()
    .custom((value, {req}) => {
      if (!(value >= 1)) {
        throw new Error('userID is invalid');
      }
      return true;
    }),
];

module.exports = deleteAccountSchema;
