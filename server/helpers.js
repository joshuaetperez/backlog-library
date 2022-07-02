const pool = require('./db');

// Returns user object if given email is active
async function getUserByEmail(email) {
  try {
    const response = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    if (response.rowCount === 0) {
      return null;
    }
    return response.rows[0];
  } catch (err) {
    console.error(err.message);
  }
}

// Returns user object if given user_id is active
async function getUserByID(user_id) {
  try {
    const response = await pool.query(
      'SELECT * FROM users WHERE user_id = $1',
      [user_id]
    );
    if (response.rowCount === 0) {
      return null;
    }
    return response.rows[0];
  } catch (err) {
    console.error(err.message);
  }
}

// Returns all of user entries in an array
async function getEntries(user_id) {
  try {
    const response = await pool.query(
      'SELECT entry_id, category_id, status_id, priority_id, title, notes FROM entries WHERE user_id = $1',
      [user_id]
    );
    return response.rows;
  } catch (err) {
    console.error(err.message);
  }
}

// Returns true if the given email already exists, false otherwise
async function checkEmailInUse(email) {
  try {
    const response = await pool.query(
      'SELECT COUNT(*) AS total FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    if (response.rows[0].total === '0') {
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
    const response = await pool.query(
      `SELECT COUNT(*) AS total FROM entries WHERE LOWER(title) = LOWER($1) AND user_id = $2 AND category_id = $3`,
      [title, user_id, category_id]
    );
    if (response.rows[0].total === '0') {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err.message);
  }
}

// Returns true if the given title, category_id, and user_id combination already exists AND the given entry_id is DIFFERENT from the entry that contains the combination, false otherwise
async function checkEdittedTitleInUse(title, category_id, user_id, entry_id) {
  if (!(category_id >= 1 && category_id <= 6)) return null;
  try {
    const response = await pool.query(
      `SELECT COUNT(*) AS total FROM entries WHERE LOWER(title) = LOWER($1) AND user_id = $2 AND category_id = $3 AND entry_id != $4`,
      [title, user_id, category_id, entry_id]
    );
    if (response.rows[0].total === '0') {
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
  checkEmailInUse,
  checkTitleInUse,
  checkEdittedTitleInUse,
  getEntries,
};
