const express = require('express');
const pool = require('../db');

const userRouter = express.Router();

userRouter.get('/user', (req, res) => {
  res.send(req.user);
});

userRouter.get('/user/verification/:token', async (req, res) => {
  try {
    await pool.query(
      'UPDATE users SET (token, token_timestamp, verified) = (null, null, TRUE) WHERE token = $1',
      [req.params.token]
    );
    res.redirect('http://localhost:3000/login');
  } catch (err) {
    console.error(err);
  }
});

module.exports = userRouter;
