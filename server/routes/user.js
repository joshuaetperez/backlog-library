const express = require('express');
const pool = require('../db');

const userRouter = express.Router();

userRouter.get('/user', (req, res) => {
  res.send(req.user);
});

userRouter.get('/user/verification/:uuid', async (req, res) => {
  try {
    await pool.query('UPDATE users SET verified = TRUE WHERE uuid = $1', [
      req.params.uuid,
    ]);
    res.redirect('http://localhost:3000/login');
  } catch (err) {
    console.error(err);
  }
});

module.exports = userRouter;
