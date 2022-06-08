const express = require('express');
const pool = require('../db');
const bcrpyt = require('bcrypt');
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
      const {username, email, password} = req.body;
      const hashedPassword = await bcrpyt.hash(password, 10);
      const newUser = await pool.query(
        'INSERT INTO users (username, email, password) VALUES($1, $2, $3) RETURNING *',
        [username, email, hashedPassword]
      );
      res.json(newUser.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  }
);

module.exports = signupRouter;
