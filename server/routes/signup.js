const express = require('express');
const pool = require('../db');
const bcrpyt = require('bcrypt');
const nodemailer = require('nodemailer');
const {v4: uuidv4} = require('uuid');
const registerSchema = require('../schema/register-schema');
const validateRequestSchema = require('../middlewares/validate-request-schema');

const signupRouter = express.Router();

// Validates form info and inserts it into the database if criteria is met
signupRouter.post(
  '/signup',
  registerSchema,
  validateRequestSchema,
  async (req, res) => {
    try {
      const {email, password} = req.body;
      const hashedPassword = await bcrpyt.hash(password, 10);
      const uuid = uuidv4();
      const newUser = await pool.query(
        'INSERT INTO users (email, password, uuid) VALUES($1, $2, $3) RETURNING *',
        [email, hashedPassword, uuid]
      );

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'backloglibrary@gmail.com',
          pass: process.env.BACKLOG_EMAIL_PW,
        },
      });

      const output = `
        <h3>New Account Verification</h3>
        <a href="http://localhost:5000/user/verification/${uuid}">Please click here to verify your email account</a>
        <p>Clicking the link will redirect you to the Backlog Library website.</p>
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

module.exports = signupRouter;
