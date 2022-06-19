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
const signupRouter = require('./routes/signup');
const entryRouter = require('./routes/entry');

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
app.use(signupRouter);
app.use(entryRouter);
app.get('/user', (req, res) => {
  res.send(req.user);
});
const port = 5000;
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
