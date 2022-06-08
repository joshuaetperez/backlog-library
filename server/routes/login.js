const express = require('express');
const {check} = require('express-validator');
const passport = require('passport');
const {checkAuthenticated} = require('../middlewares/check-authentication');

const loginRouter = express.Router();

loginRouter.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: 'http://localhost:3000/',
    failureRedirect: 'http://localhost:3000/login',
    failureFlash: true,
  })
);

module.exports = loginRouter;
