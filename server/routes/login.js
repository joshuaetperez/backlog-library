const express = require('express');
const passport = require('passport');

const loginRouter = express.Router();

loginRouter.post('/login', (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({message: info.message});
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      res.json({message: 'Logged in successfully!'});
    });
  })(req, res, next);
});

loginRouter.delete('/logout', (req, res) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.json({message: 'Logged out successfully!'});
  });
});

module.exports = loginRouter;
