const express = require('express');
const pool = require('../db');
const bcrpyt = require('bcrypt');
const nodemailer = require('nodemailer');
const {v4: uuidv4} = require('uuid');
const registerSchema = require('../schema/register-schema');
const reverifySchema = require('../schema/reverify-schema');
const validateRequestSchema = require('../middlewares/validate-request-schema');

const signupRouter = express.Router();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'backloglibrary@gmail.com',
    pass: process.env.BACKLOG_EMAIL_PW,
  },
});

// Validates form info and inserts user account info into the database if criteria is met
signupRouter.post(
  '/signup',
  registerSchema,
  validateRequestSchema,
  async (req, res) => {
    try {
      const {email, password} = req.body;
      const hashedPassword = await bcrpyt.hash(password, 10);
      const token = uuidv4();
      const newUser = await pool.query(
        `INSERT INTO users (email, password, token, token_timestamp) VALUES($1, $2, $3, to_timestamp(${
          Date.now() / 1000
        })) RETURNING *`,
        [email, hashedPassword, token]
      );

      const output = `
        <h3>New Account Verification</h3>
        <a href="http://localhost:5000/user/verification/${token}">Please click here to verify your email account</a>
        <p>Ignore this email if you did not create a Backlog Library account.</p>
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
      res.json(newUser.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  }
);

// Validates email from form info and updates token and token_timestamp of user
signupRouter.post(
  '/reverify',
  reverifySchema,
  validateRequestSchema,
  async (req, res) => {
    try {
      const {email} = req.body;
      const token = uuidv4();
      const updatedUser = await pool.query(
        `UPDATE users SET (token, token_timestamp) = ($1, to_timestamp(${
          Date.now() / 1000
        })) WHERE email = $2 RETURNING *`,
        [token, email]
      );

      const output = `
        <h3>Resent Email Verification</h3>
        <a href="http://localhost:5000/user/verification/${token}">Please click here to verify your email account</a>
        <p>Ignore this email if you did not create a Backlog Library account.</p>
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
      res.json(updatedUser.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  }
);

module.exports = signupRouter;
