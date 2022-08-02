const express = require('express');
const loginRouter = require('./routes/login');
const userAuthenticationRouter = require('./routes/user-authentication');
const entryRouter = require('./routes/entry');
const userRouter = require('./routes/user');
const tokenRouter = require('./routes/token');

const router = express.Router();

router.use(loginRouter);
router.use(userAuthenticationRouter);
router.use(entryRouter);
router.use(userRouter);
router.use(tokenRouter);

module.exports = router;
