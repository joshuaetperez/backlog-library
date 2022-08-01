if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const PORT = process.env.PORT || 8080;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport');
const initializePassport = require('./passport-config');
const session = require('express-session');

const loginRouter = require('./routes/login');
const userAuthenticationRouter = require('./routes/user-authentication');
const entryRouter = require('./routes/entry');
const userRouter = require('./routes/user');
const tokenRouter = require('./routes/token');

initializePassport(passport);

app.use(cors({origin: CLIENT_URL, credentials: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(loginRouter);
app.use(userAuthenticationRouter);
app.use(entryRouter);
app.use(userRouter);
app.use(tokenRouter);

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
