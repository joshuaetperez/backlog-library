if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const {CLIENT_URL} = require('./http');
const PORT = process.env.PORT || 5000;

const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport');
const initializePassport = require('./passport-config');
const session = require('express-session');
const router = require('./routes');

initializePassport(passport);

app.use(cors({origin: CLIENT_URL, credentials: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
      secure: process.env.NODE_ENV === 'production', // must be true if sameSite='none'
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
