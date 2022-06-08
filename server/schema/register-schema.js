const {body} = require('express-validator');
const pool = require('../db');

const registerSchema = [
  body('username')
    .exists()
    .isLength({min: 1, max: 20})
    .withMessage(
      'Username cannot be empty and must contain 20 characters or less'
    )
    .custom(async (value) => {
      if (await isUsernameInUse(value)) {
        throw new Error('Username is already in use');
      }
    }),
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

// Returns true if the given username already exists, false otherwise
async function isUsernameInUse(username) {
  try {
    const res = await pool.query(
      'SELECT COUNT(*) AS total FROM users WHERE username = $1',
      [username]
    );
    if (res.rows[0].total === '0') {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err.message);
  }
}

// Returns true if the given email already exists, false otherwise
async function isEmailInUse(email) {
  try {
    const res = await pool.query(
      'SELECT COUNT(*) AS total FROM users WHERE email = $1',
      [email]
    );
    if (res.rows[0].total === '0') {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = registerSchema;
