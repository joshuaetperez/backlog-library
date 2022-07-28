const express = require('express');
const pool = require('../db');
const transporter = require('../email_helpers');
const {checkPassword} = require('../helpers');
const confirmPasswordSchema = require('../schema/confirm-password-schema');
const deleteAccountSchema = require('../schema/delete-account-schema');
const validateRequestSchema = require('../middlewares/validate-request-schema');

const userRouter = express.Router();
const tokenTimeLimit = process.env.TOKEN_TIME_LIMIT;

// Returns the user object to the client
userRouter.get('/user', (req, res) => {
  res.send(req.user);
});

// Verifies the user's account if the verification token is still valid
userRouter.get('/user/verification/:token', async (req, res) => {
  try {
    await pool.query(
      'UPDATE users SET (token, token_timestamptz, verified) = (null, null, TRUE) WHERE token = $1',
      [req.params.token]
    );
    res.redirect('http://localhost:3000/login');
  } catch (err) {
    console.error(err.message);
  }
});

// Redirects user to a page which allows them to change their password if the token is still valid
userRouter.get('/user/forgot-password/:token', async (req, res) => {
  res.redirect(`http://localhost:3000/reset-password/${req.params.token}`);
});

// Checks if the given token is still valid
userRouter.get('/user/check-token/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const result = await pool.query(
      'SELECT token_timestamptz FROM users WHERE token = $1',
      [token]
    );
    if (result.rows.length === 0) {
      return res.send('Invalid token');
    }

    const timeNow = new Date().getTime();
    // If the link has expired, the token should no longer work
    if (tokenTimeLimit < timeNow - result.rows[0].token_timestamptz.getTime()) {
      return res.send('Expired token');
    }
    // If the link has NOT expired, the token is considered valid
    res.send('Valid token');
  } catch (err) {
    console.error(err.message);
  }
});

// Checks if given password is correct
userRouter.post(
  '/user/confirm-password',
  confirmPasswordSchema,
  validateRequestSchema,
  async (req, res) => {
    if (await checkPassword(req.user.userID, req.body.password)) {
      return res.send('Password is correct');
    }
    res.send('Password is incorrect');
  }
);

// Deletes account of given user_id
userRouter.delete(
  '/user/delete-account/:userID',
  deleteAccountSchema,
  validateRequestSchema,
  async (req, res) => {
    try {
      const userID = req.params.userID;
      await pool.query('DELETE FROM entries WHERE user_id = $1', [userID]);
      const result = await pool.query(
        'DELETE FROM users WHERE user_id = $1 RETURNING email',
        [userID]
      );
      const email = result.rows[0].email;
      req.session.destroy();

      const output = `
        <h3>Account Deletion Confirmation</h3>
        <p>We are sending this email to confirm that you have successfully deleted your Backlog Library account.</p>
        <p>If you have any questions or need help, please contact me at joshuaetperez@gmail.com.</p>
      `;
      transporter.sendMail(
        {
          from: '"Backlog Library" <backloglibrary@gmail.com>',
          to: email,
          subject: 'Account Deletion Confirmation',
          html: output,
        },
        (err, info) => {
          if (err) {
            console.error(err);
          } else {
            console.log('Message sent: %s', info.messageId);
          }
        }
      );

      res.send('Account has been successfully deleted!');
    } catch (err) {
      console.error(err.message);
    }
  }
);

module.exports = userRouter;
