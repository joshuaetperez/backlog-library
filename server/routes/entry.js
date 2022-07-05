const express = require('express');
const pool = require('../db');
const {getEntries} = require('../helpers');
const validateRequestSchema = require('../middlewares/validate-request-schema');
const addEntrySchema = require('../schema/add-entry-schema');
const editEntrySchema = require('../schema/edit-entry-scheme');

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

// Validates form info and edits the corresponding entry in the database if criteria is met
modalEntryRouter.post(
  '/edit_entry',
  editEntrySchema,
  validateRequestSchema,
  async (req, res) => {
    try {
      const {entryID, categoryID, statusID, priorityID, title, notes} =
        req.body;
      const editedEntry = await pool.query(
        `UPDATE entries SET (category_id, status_id, priority_id, title, notes) = ($1, $2, $3, $4, $5) WHERE entry_id = $6 RETURNING *`,
        [categoryID, statusID, priorityID, title, notes, entryID]
      );
      res.json(editedEntry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  }
);

// Fetches all entries belonging to the user and sends it to the client
modalEntryRouter.get('/get_entries', async (req, res) => {
  try {
    const entries = await getEntries(req.user.userID);
    res.send(entries);
  } catch (err) {
    console.error(err.message);
  }
});

// Deletes an entry with the given entry_id
modalEntryRouter.delete('/delete_entry/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM entries WHERE entry_id = $1', [
      req.params.id,
    ]);
    res.send('Entry deleted successfully');
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = modalEntryRouter;
