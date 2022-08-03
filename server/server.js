if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const {CLIENT_URL} = require('./http');
const PORT = process.env.PORT || 5000;

const express = require('express');
const path = require('path');
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
  })
);
app.use(passport.initialize());
app.use(passport.session());

// React build directory
app.use(express.static(path.join(__dirname, 'build')));

app.use('/api', router);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
