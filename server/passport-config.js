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
  passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });
  passport.deserializeUser(async (user_id, done) => {
    const user = await getUserByID(user_id);
    done(null, user);
  });
}

async function getUserByEmail(email) {
  const response = await pool.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);
  if (response.rowCount === 0) {
    return null;
  }
  return response.rows[0];
}

async function getUserByID(user_id) {
  const response = await pool.query('SELECT * FROM users WHERE user_id = $1', [
    user_id,
  ]);
  if (response.rowCount === 0) {
    return null;
  }
  return response.rows[0];
}

module.exports = initialize;
