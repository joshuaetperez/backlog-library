const express = require('express');
const pool = require('../db');
const {getEntries} = require('../helpers');
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

modalEntryRouter.get('/get_entries', async (req, res) => {
  const entries = await getEntries(req.user.userID);
  res.send(entries);
});

module.exports = modalEntryRouter;
