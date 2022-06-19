const pool = require('./db');

// Returns user object if given email is active
async function getUserByEmail(email) {
  const response = await pool.query(
    'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
    [email]
  );
  if (response.rowCount === 0) {
    return null;
  }
  return response.rows[0];
}

// Returns user object if given user_id is active
async function getUserByID(user_id) {
  const response = await pool.query('SELECT * FROM users WHERE user_id = $1', [
    user_id,
  ]);
  if (response.rowCount === 0) {
    return null;
  }
  return response.rows[0];
}

// Returns true if the given email already exists, false otherwise
async function isEmailInUse(email) {
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

// Returns true if the given title, category, AND user_id combination already exists, false otherwise
async function isTitleInUse(title, category, user_id) {
  try {
    let query = null;
    if (category === 'Movies') {
      (query = `SELECT COUNT(*) AS total FROM movies WHERE LOWER(title) = LOWER($1) AND user_id = $2`),
        [title, user_id];
    } else if (category === 'TV') {
      (query = `SELECT COUNT(*) AS total FROM tv WHERE LOWER(title) = LOWER($1) AND user_id = $2`),
        [title, user_id];
    } else if (category === 'Anime') {
      (query = `SELECT COUNT(*) AS total FROM anime WHERE LOWER(title) = LOWER($1) AND user_id = $2`),
        [title, user_id];
    } else if (category === 'Manga') {
      (query = `SELECT COUNT(*) AS total FROM manga WHERE LOWER(title) = LOWER($1) AND user_id = $2`),
        [title, user_id];
    } else if (category === 'Games') {
      (query = `SELECT COUNT(*) AS total FROM games WHERE LOWER(title) = LOWER($1) AND user_id = $2`),
        [title, user_id];
    } else if (category === 'Books') {
      (query = `SELECT COUNT(*) AS total FROM books WHERE LOWER(title) = LOWER($1) AND user_id = $2`),
        [title, user_id];
    }
    if (query === null) {
      return null;
    }
    const response = await pool.query(query, [title, user_id]);
    if (response.rows[0].total === '0') {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = {getUserByEmail, getUserByID, isEmailInUse, isTitleInUse};
