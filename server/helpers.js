const pool = require('./db');
const bcrpyt = require('bcrypt');

// Returns user object if given email is active
async function getUserByEmail(email) {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (err) {
    console.error(err.message);
  }
}

// Returns user object if given user_id is active
async function getUserByID(user_id) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [
      user_id,
    ]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (err) {
    console.error(err.message);
  }
}

// Returns all of user entries in an array
async function getEntries(user_id) {
  try {
    const result = await pool.query(
      'SELECT entry_id, category_id, status_id, priority_id, title, notes FROM entries WHERE user_id = $1',
      [user_id]
    );
    return result.rows;
  } catch (err) {
    console.error(err.message);
  }
}

// Returns true if the given email already exists, false otherwise
async function checkEmailInUse(email) {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    if (result.rows.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err.message);
  }
}

// Returns true if the given email has already been verified, false otherwise
async function checkEmailVerification(email) {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1) AND verified = TRUE',
      [email]
    );
    if (result.rows.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err.message);
  }
}

// Returns true if the given email has already been verified, false otherwise
async function checkEmailNotVerified(email) {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1) AND verified = FALSE',
      [email]
    );
    if (result.rows.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err.message);
  }
}

// Returns true if the given title, category_id, and user_id combination already exists, false otherwise
async function checkTitleInUse(title, category_id, user_id) {
  if (!(category_id >= 1 && category_id <= 6)) return null;
  try {
    const result = await pool.query(
      `SELECT * FROM entries WHERE LOWER(title) = LOWER($1) AND user_id = $2 AND category_id = $3`,
      [title, user_id, category_id]
    );
    if (result.rows.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err.message);
  }
}

// Returns true if the given token is associated to a user, false otherwise
async function checkToken(token) {
  if (token === '' || token === null) return false;
  try {
    const result = await pool.query('SELECT * FROM users WHERE token = $1', [
      token,
    ]);
    if (result.rows.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err.message);
  }
}

// Returns true if the given password belongs to the user, false otherwise
async function checkPassword(user_id, password) {
  try {
    const result = await pool.query(
      'SELECT password FROM users WHERE user_id = $1',
      [user_id]
    );
    if (
      result.rows.length !== 0 &&
      (await bcrpyt.compare(password, result.rows[0].password))
    ) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err.message);
  }
}

// Returns true if the given title, category_id, and user_id combination already exists AND the given entry_id is DIFFERENT from the entry that contains the combination, false otherwise
async function checkEditedTitleInUse(title, category_id, user_id, entry_id) {
  if (!(category_id >= 1 && category_id <= 6)) return null;
  try {
    const result = await pool.query(
      `SELECT * FROM entries WHERE LOWER(title) = LOWER($1) AND user_id = $2 AND category_id = $3 AND entry_id != $4`,
      [title, user_id, category_id, entry_id]
    );
    if (result.rows.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = {
  getUserByEmail,
  getUserByID,
  getEntries,
  checkEmailInUse,
  checkEmailVerification,
  checkEmailNotVerified,
  checkToken,
  checkPassword,
  checkTitleInUse,
  checkEditedTitleInUse,
};
