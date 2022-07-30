const express = require('express');
const pool = require('../db');

const tokenRouter = express.Router();
const tokenTimeLimit = process.env.TOKEN_TIME_LIMIT;

// Verifies the user's account if the verification token is still valid
tokenRouter.get('/verification/:token', async (req, res) => {
  try {
    await pool.query(
      'UPDATE users SET (token, token_timestamptz, verified) = (null, null, TRUE) WHERE token = $1',
      [req.params.token]
    );
    res.redirect('http://localhost:3000/login');
  } catch (err) {
    console.error(err.message);
  }
});

// Redirects user to a page which allows them to change their password if the token is still valid
tokenRouter.get('/forgot-password/:token', (req, res) => {
  res.redirect(`http://localhost:3000/reset-password/${req.params.token}`);
});

// Redirects user to a page which change user email if token is still valid
tokenRouter.get('/change-email-verification/:token', (req, res) => {
  res.redirect(`http://localhost:3000/change-email-status/${req.params.token}`);
});

// Checks if the given token is still valid
tokenRouter.get('/check-token/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const result = await pool.query(
      'SELECT token_timestamptz FROM users WHERE token = $1',
      [token]
    );
    if (result.rows.length === 0) {
      return res.json({message: 'Invalid token'});
    }

    const timeNow = new Date().getTime();
    // If the link has expired, the token should no longer work
    if (tokenTimeLimit < timeNow - result.rows[0].token_timestamptz.getTime()) {
      return res.json({message: 'Expired token'});
    }
    // If the link has NOT expired, the token is considered valid
    res.json({message: 'Valid token'});
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = tokenRouter;
