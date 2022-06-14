const {body} = require('express-validator');
const pool = require('../db');

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

// Returns true if the given email already exists, false otherwise
async function isEmailInUse(email) {
  try {
    const response = await pool.query(
      'SELECT COUNT(*) AS total FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    if (response.rows[0].total === '0') {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = registerSchema;
