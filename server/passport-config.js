const LocalStrategy = require('passport-local').Strategy;
const pool = require('./db');
const bcrpyt = require('bcrypt');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);
    if (user == null) {
      return done(null, false, {
        message: 'Login failed. Invalid email or password',
      });
    }
    try {
      if (await bcrpyt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: 'Login failed. Invalid email or password',
        });
      }
    } catch (err) {
      return done(err);
    }
  };
  passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.user_id));
  passport.deserializeUser(async (user_id, done) => {
    const user = await getUserByID(user_id);
    return done(null, user);
  });
}

async function getUserByEmail(email) {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (res.rowCount === 0) {
    return null;
  }
  return res.rows[0];
}

async function getUserByID(user_id) {
  const res = await pool.query('SELECT * FROM users WHERE user_id = $1', [
    user_id,
  ]);
  if (res.rowCount === 0) {
    return null;
  }
  return res.rows[0];
}

module.exports = initialize;
