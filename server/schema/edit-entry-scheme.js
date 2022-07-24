const {body, param} = require('express-validator');
const {getUserByID, checkEditedTitleInUse} = require('../helpers');

const editEntrySchema = [
  param('entryID')
    .exists()
    .toInt()
    .custom((value, {req}) => {
      if (!(value >= 1)) {
        throw new Error('EntryID is invalid');
      }
      return true;
    }),
  body('title')
    .exists()
    .isLength({min: 1, max: 200})
    .withMessage('Title must contain between 1 and 100 characters')
    .custom(async (value, {req}) => {
      const user = await getUserByID(req.user.userID);
      if (user === null) {
        throw new Error('Unknown user');
      }
      const isEditedTitleInUse = await checkEditedTitleInUse(
        value,
        req.body.categoryID,
        req.user.userID,
        req.body.entryID
      );
      if (isEditedTitleInUse === null) {
        throw new Error('Category is invalid so title cannot be checked');
      } else if (isEditedTitleInUse) {
        throw new Error('Title already exists in this category');
      }
      return true;
    }),
  body('categoryID')
    .exists()
    .custom((value, {req}) => {
      if (!(value >= 1 && value <= 6)) {
        throw new Error('Category is invalid');
      }
      return true;
    }),
  body('statusID')
    .exists()
    .custom((value, {req}) => {
      if (!(value >= 1 && value <= 2)) {
        throw new Error('Status is invalid');
      }
      return true;
    }),
  body('priorityID')
    .exists()
    .custom((value, {req}) => {
      if (!(value >= 1 && value <= 3)) {
        throw new Error('Priority is invalid');
      }
      return true;
    }),
  body('notes')
    .exists()
    .isLength({max: 1000})
    .withMessage('Notes cannot be more than 1000 characters'),
];

module.exports = editEntrySchema;
