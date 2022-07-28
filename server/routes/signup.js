const express = require('express');
const pool = require('../db');
const bcrpyt = require('bcrypt');
const crypto = require('crypto');
const transporter = require('../email_helpers');
const registerSchema = require('../schema/register-schema');
const reverifySchema = require('../schema/reverify-schema');
const forgotPasswordSchema = require('../schema/forgot-password-schema');
const resetPasswordSchema = require('../schema/reset-password-schema');
const validateRequestSchema = require('../middlewares/validate-request-schema');
const tokenTimeLimit = process.env.TOKEN_TIME_LIMIT;

const signupRouter = express.Router();

// Validates form info and inserts user account info into the database if criteria is met
signupRouter.post(
  '/signup',
  registerSchema,
  validateRequestSchema,
  async (req, res) => {
    try {
      const {email, password} = req.body;
      const hashedPassword = await bcrpyt.hash(password, 10);
      const token = crypto.randomBytes(64).toString('hex');
      const now = new Date();
      const result = await pool.query(
        'INSERT INTO users (email, password, token, token_timestamptz) VALUES($1, $2, $3, $4) RETURNING *',
        [email, hashedPassword, token, now]
      );

      const output = `
        <h3>New Account Verification</h3>
        <a href="http://localhost:5000/user/verification/${token}">Please click here to verify your email account</a>
        <p>Ignore this email if you did not create a Backlog Library account.</p>
        <p>If you have any questions or need help, please contact me at joshuaetperez@gmail.com.</p>
      `;
      transporter.sendMail(
        {
          from: '"Backlog Library" <backloglibrary@gmail.com>',
          to: email,
          subject: 'New Account Verification',
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
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  }
);

// Validates email from form info and updates token and token_timestamptz of user
signupRouter.post(
  '/reverify',
  reverifySchema,
  validateRequestSchema,
  async (req, res) => {
    try {
      const {email} = req.body;
      const token = crypto.randomBytes(64).toString('hex');
      const now = new Date();
      const result = await pool.query(
        'UPDATE users SET (token, token_timestamptz) = ($1, $2) WHERE email = $3 RETURNING *',
        [token, now, email]
      );

      const output = `
        <h3>Resent Email Verification</h3>
        <a href="http://localhost:5000/user/verification/${token}">Please click here to verify your email account</a>
        <p>Ignore this email if you did not create a Backlog Library account.</p>
        <p>If you have any questions or need help, please contact me at joshuaetperez@gmail.com.</p>
      `;
      transporter.sendMail(
        {
          from: '"Backlog Library" <backloglibrary@gmail.com>',
          to: email,
          subject: 'Resent Email Verification',
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
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  }
);

// Sends email to user containing a link to change password
signupRouter.post(
  '/forgot-password',
  forgotPasswordSchema,
  validateRequestSchema,
  async (req, res) => {
    try {
      const {email} = req.body;
      const token = crypto.randomBytes(64).toString('hex');
      const now = new Date();
      const result = await pool.query(
        'UPDATE users SET (token, token_timestamptz) = ($1, $2) WHERE email = $3 RETURNING *',
        [token, now, email]
      );

      const resetLink = `<a href="http://localhost:5000/user/forgot-password/${token}" style='display: inline-block; background-color: #489be8; color: #FFFFFF; padding: 10px 20px; border: none; border-radius: 3px; text-decoration: none;'>Reset Password</a>`;
      const output = `
        <h3>Password Reset Request</h3>
        <p>We received your request for a password reset on this account. Click on the bottom below to reset your password.</p>
        ${resetLink}
        <p><b>This link will expire in 24 hours.</b> Ignore this email if you did not request a password change.</p>
        <p>If you have any questions or need help, please contact me at joshuaetperez@gmail.com.</p>
      `;
      transporter.sendMail(
        {
          from: '"Backlog Library" <backloglibrary@gmail.com>',
          to: email,
          subject: 'Password Reset Request',
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
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  }
);

// Changes user password if token is still valid
signupRouter.post(
  '/reset-password/:token',
  resetPasswordSchema,
  validateRequestSchema,
  async (req, res) => {
    try {
      const {newPassword} = req.body;
      const token = req.params.token;
      const tokenResult = await pool.query(
        'SELECT * FROM users WHERE token = $1',
        [token]
      );
      if (tokenResult.rows.length === 0) {
        return res.send('Reset Password failed: Invalid token');
      } else if (
        await bcrpyt.compare(newPassword, tokenResult.rows[0].password)
      ) {
        return res.send(
          'Reset Password failed: New password cannot be the same as your old password'
        );
      }

      const timeNow = new Date().getTime();
      // If the link has expired, the token should no longer work
      if (
        tokenTimeLimit <
        timeNow - tokenResult.rows[0].token_timestamptz.getTime()
      ) {
        return res.send('Reset Password failed: Expired token');
      }

      const hashedPassword = await bcrpyt.hash(newPassword, 10);
      const updateResult = await pool.query(
        'UPDATE users SET (password, token, token_timestamptz) = ($1, null, null) WHERE token = $2 RETURNING email',
        [hashedPassword, token]
      );
      const email = updateResult.rows[0].email;

      const output = `
        <h3>Password Reset Confirmation</h3>
        <p>We are sending this email to confirm that you have successfully changed your password to this account.</p>
        <p>If you have any questions or need help, please contact me at joshuaetperez@gmail.com.</p>
      `;
      transporter.sendMail(
        {
          from: '"Backlog Library" <backloglibrary@gmail.com>',
          to: email,
          subject: 'Password Reset Confirmation',
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
      res.send('Reset Password successfully!');
    } catch (err) {
      console.error(err.message);
    }
  }
);

module.exports = signupRouter;
