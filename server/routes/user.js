const express = require('express');
const pool = require('../db');
const bcrpyt = require('bcrypt');
const crypto = require('crypto');
const transporter = require('../nodemailer_helpers');
const {checkPassword, getEntries, checkEmailInUse} = require('../helpers');
const addEntrySchema = require('../schema/add-entry-schema');
const confirmPasswordSchema = require('../schema/confirm-password-schema');
const changeEmailSchema = require('../schema/change-email-schema');
const resetPasswordSchema = require('../schema/reset-password-schema');
const validateRequestSchema = require('../middlewares/validate-request-schema');
const {SERVER_URL} = require('../http');

const userRouter = express.Router();

// Returns the user object to the client
userRouter.get('/user', (req, res) => {
  res.send(req.user);
});

// Fetches all entries belonging to the user and sends it to the client
userRouter.get('/user/get-entries', async (req, res) => {
  try {
    const entries = await getEntries(req.user.userID);
    res.json(entries);
  } catch (err) {
    console.error(err.message);
  }
});

// Validates form info and inserts it into the database if criteria is met
userRouter.post(
  '/user/add-entry',
  addEntrySchema,
  validateRequestSchema,
  async (req, res) => {
    try {
      const {categoryID, statusID, priorityID, title, notes} = req.body;
      const newEntry = await pool.query(
        `INSERT INTO entries (user_id, category_id, status_id, priority_id, title, notes) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
        [req.user.userID, categoryID, statusID, priorityID, title, notes]
      );
      res.json(newEntry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  }
);

// Checks if given password is correct
userRouter.post(
  '/user/confirm-password',
  confirmPasswordSchema,
  validateRequestSchema,
  async (req, res) => {
    if (await checkPassword(req.user.userID, req.body.password)) {
      return res.json({message: 'Password is correct'});
    }
    res.json({message: 'Password is incorrect'});
  }
);

// Checks if given password is correct
userRouter.post(
  '/user/change-email',
  changeEmailSchema,
  validateRequestSchema,
  async (req, res) => {
    const userID = req.user.userID;
    const {newEmail} = req.body;
    const emailResult = await pool.query(
      'SELECT email FROM users WHERE user_id = $1',
      [userID]
    );
    const oldEmail = emailResult.rows[0].email;

    if (emailResult.rows.length === 0) {
      return res.json({message: 'Change Email failed: No user found'});
    }
    if (newEmail === oldEmail) {
      return res.json({
        message:
          'Change Email failed: New email cannot be the same as your current email',
      });
    }
    if (checkEmailInUse(newEmail)) {
      return res.json({
        message: 'Change Email failed: New email is already taken',
      });
    }

    const token = crypto.randomBytes(64).toString('hex');
    const now = new Date();
    await pool.query(
      'UPDATE users SET (new_email, token, token_timestamptz) = ($1, $2, $3) WHERE user_id = $4',
      [newEmail, token, now, userID]
    );

    const oldEmailOutput = `
        <h3>Email Change Confirmation</h3>
        <p>We are sending this email to confirm that you have successfully sent a request to change the email associated to your Backlog Library account to your new email ${newEmail}.</p>
        <p>Please check your new email to verify your email change. <b>The verification link will expire in 24 hours.</b></p>
        <p>If you are not the user of the Backlog Library account associated with this email address, please ignore this email. If you are the user of the registered account and did not request this email change, please contact me at joshuaetperez@gmail.com.</p>
      `;
    transporter.sendMail(
      {
        from: '"Backlog Library" <backloglibrary@gmail.com>',
        to: oldEmail,
        subject: 'Email Change Confirmation',
        html: oldEmailOutput,
      },
      (err, info) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Message sent: %s', info.messageId);
        }
      }
    );
    const newEmailOutput = `
        <h3>Email Change Verification</h3>
        <a href="${SERVER_URL}/change-email-verification/${token}">Please click here to verify that you want to change the email address associated with your Backlog Library account to this email address.</a>
        <p><b>This link will expire in 24 hours.</b> Ignore this email if you did not request for an email change.</p>
        <p>If you have any questions or need help, please contact me at joshuaetperez@gmail.com.</p>
      `;
    transporter.sendMail(
      {
        from: '"Backlog Library" <backloglibrary@gmail.com>',
        to: newEmail,
        subject: 'Email Change Verification',
        html: newEmailOutput,
      },
      (err, info) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Message sent: %s', info.messageId);
        }
      }
    );

    res.json({message: 'Received change email request'});
  }
);

// Changes password of the user
userRouter.post(
  '/user/change-password',
  resetPasswordSchema,
  validateRequestSchema,
  async (req, res) => {
    const userID = req.user.userID;
    const {newPassword} = req.body;
    const passwordResult = await pool.query(
      'SELECT password FROM users WHERE user_id = $1',
      [userID]
    );
    if (passwordResult.rows.length === 0) {
      return res.json({message: 'Change Password failed: No user found'});
    } else if (
      await bcrpyt.compare(newPassword, passwordResult.rows[0].password)
    ) {
      return res.json({
        message:
          'Change Password failed: New password cannot be the same as your old password',
      });
    }

    const hashedPassword = await bcrpyt.hash(newPassword, 10);
    const updateResult = await pool.query(
      'UPDATE users SET password = $1 WHERE user_id = $2 RETURNING email',
      [hashedPassword, userID]
    );
    const email = updateResult.rows[0].email;

    const output = `
        <h3>Password Change Confirmation</h3>
        <p>We are sending this email to confirm that you have successfully changed your password to this account.</p>
        <p>If you have any questions or need help, please contact me at joshuaetperez@gmail.com.</p>
      `;
    transporter.sendMail(
      {
        from: '"Backlog Library" <backloglibrary@gmail.com>',
        to: email,
        subject: 'Password Change Confirmation',
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

    res.json({message: 'Password has been changed successfully!'});
  }
);

module.exports = userRouter;
