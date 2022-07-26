const {param} = require('express-validator');

const deleteEntriesSchema = [
  param('userID')
    .exists()
    .custom((value, {req}) => {
      if (!(value >= 1)) {
        throw new Error('userID is invalid');
      }
      return true;
    }),
  param('categoryID')
    .exists()
    .custom((value, {req}) => {
      if (!(value >= 0 && value <= 6)) {
        throw new Error('categoryID is invalid');
      }
      return true;
    }),
];

module.exports = deleteEntriesSchema;
