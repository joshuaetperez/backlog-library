const express = require('express');
const pool = require('../db');
const {getUserByID, getUserByEmail} = require('../helpers');
const validateRequestSchema = require('../middlewares/validate-request-schema');
const addEntrySchema = require('../schema/add-entry-schema');

const modalEntryRouter = express.Router();

// Validates form info and inserts it into the database if criteria is met
modalEntryRouter.post(
  '/add_entry',
  addEntrySchema,
  validateRequestSchema,
  async (req, res) => {
    try {
      const {email, category, title, status, priority, notes} = req.body;
      const table = category.toLowerCase();
      const user = await getUserByEmail(email);
      const user_id = user.user_id;

      // Table name has already been validated so no worry about SQL injections
      const newEntry = await pool.query(
        `INSERT INTO ${table} (user_id, title, status, priority, notes) VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [user_id, title, status, priority, notes]
      );
      res.json(newEntry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  }
);

module.exports = modalEntryRouter;
