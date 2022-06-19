const {body} = require('express-validator');
const {getUserByEmail, isEmailInUse, isTitleInUse} = require('../helpers');

const addEntrySchema = [
  body('email')
    .exists()
    .isEmail()
    .withMessage('Email must be a valid email address')
    .custom(async (value, {req}) => {
      if (!(await isEmailInUse(value))) {
        throw new Error('Email is not registered to an active user');
      }
      return true;
    }),
  body('title')
    .exists()
    .isLength({min: 1, max: 100})
    .withMessage('Title must contain between 1 and 100 characters')
    .custom(async (value, {req}) => {
      const user = await getUserByEmail(req.body.email);
      if (user === null) {
        throw new Error(
          'Title cannot be check because given email is not registered to an active user'
        );
      }
      const user_id = user.user_id;
      if (await isTitleInUse(value, req.body.category, user_id)) {
        throw new Error('Title already exists in this category with this user');
      }
      return true;
    }),
  body('category')
    .exists()
    .custom((value, {req}) => {
      if (
        !['Movies', 'TV', 'Anime', 'Manga', 'Games', 'Manga'].includes(value)
      ) {
        throw new Error('Category is invalid');
      }
      return true;
    }),
  body('status')
    .exists()
    .custom((value, {req}) => {
      if (!['Ongoing', 'Planning'].includes(value)) {
        throw new Error('Status is invalid');
      }
      return true;
    }),
  body('priority')
    .exists()
    .custom((value, {req}) => {
      if (!['High', 'Medium', 'Low'].includes(value)) {
        throw new Error('Priority is invalid');
      }
      return true;
    }),
  body('notes')
    .exists()
    .isLength({max: 1000})
    .withMessage('Notes cannot be more than 1000 characters'),
];

module.exports = addEntrySchema;
