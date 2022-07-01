const express = require('express');

const userRouter = express.Router();

userRouter.get('/user', (req, res) => {
  res.send(req.user);
});

module.exports = userRouter;
