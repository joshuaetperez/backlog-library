const express = require('express');
const pool = require('../db');

const userRouter = express.Router();
const tokenTimeLimit = process.env.TOKEN_TIME_LIMIT;

userRouter.get('/user', (req, res) => {
  res.send(req.user);
});

userRouter.get('/user/verification/:token', async (req, res) => {
  try {
    await pool.query(
      'UPDATE users SET (token, token_timestamptz, verified) = (null, null, TRUE) WHERE token = $1',
      [req.params.token]
    );
    res.redirect('http://localhost:3000/login');
  } catch (err) {
    console.error(err);
  }
});

userRouter.get('/user/forgot-password/:token', async (req, res) => {
  res.redirect(`http://localhost:3000/reset-password/${req.params.token}`);
});

userRouter.get('/user/check-token/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const response = await pool.query(
      'SELECT token_timestamptz FROM users WHERE token = $1',
      [token]
    );
    if (response.rows.length === 0) {
      return res.send('Invalid token');
    }

    const timeNow = new Date().getTime();
    // If the link has expired, the token should no longer work
    if (
      tokenTimeLimit <
      timeNow - response.rows[0].token_timestamptz.getTime()
    ) {
      return res.send('Expired token');
    }
    // If the link has NOT expired, the token is considered valid
    res.send('Valid token');
  } catch (err) {
    console.error(err);
  }
});

module.exports = userRouter;
