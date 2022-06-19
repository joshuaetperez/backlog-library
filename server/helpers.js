const pool = require('./db');

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

module.exports = {getUserByEmail, getUserByID, isEmailInUse};
