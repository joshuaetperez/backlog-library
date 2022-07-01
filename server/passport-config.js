const LocalStrategy = require('passport-local').Strategy;
const bcrpyt = require('bcrypt');
const {getUserByEmail, getUserByID} = require('./helpers');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);
    if (user == null) {
      return done(null, false, {
        message: 'Login failed. Incorrect email or password.',
      });
    }
    try {
      if (await bcrpyt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: 'Login failed. Incorrect email or password.',
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
    const userObj = {userID: user_id, email: user.email};
    done(null, userObj);
  });
}

module.exports = initialize;
