const {param} = require('express-validator');

const deleteEntrySchema = [
  param('entryID')
    .exists()
    .custom((value, {req}) => {
      if (!(value >= 1)) {
        throw new Error('entryID is invalid');
      }
      return true;
    }),
];

module.exports = deleteEntrySchema;
