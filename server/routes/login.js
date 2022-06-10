const express = require('express');
const passport = require('passport');
const {checkAuthenticated} = require('../middlewares/check-authentication');

const loginRouter = express.Router();

loginRouter.post('/login', (req, res) => {
  passport.authenticate('local', (err, user) => {
    if (err) throw err;
    if (!user) res.send('No user exists');
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send('Logged in sucessfully!');
      });
    }
  })(req, res);
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
