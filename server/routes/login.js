const express = require('express');
const passport = require('passport');
const {checkAuthenticated} = require('../middlewares/check-authentication');

const loginRouter = express.Router();

loginRouter.post('/login', passport.authenticate('local'), (req, res) => {
  res.send('Logged in successfully!');
});

// Logs out user and redirects user to login page
loginRouter.delete('/logout', (req, res) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.send('Logged out successfully!');
  });
});

module.exports = loginRouter;
