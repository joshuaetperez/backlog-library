const express = require('express');
const app = express();
const cors = require('cors');
const bcrpyt = require('bcrypt');
const passport = require('passport');
const initializePassport = require('./passport-config');
const flash = require('express-flash');
const session = require('express-session');

const signupRouter = require('./routes/signup');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(signupRouter);

const port = 5000;
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
