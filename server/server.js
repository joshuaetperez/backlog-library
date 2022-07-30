if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

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

app.use(cors({origin: 'http://localhost:3000', credentials: true}));
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

const port = 5000;
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
