import {useState} from 'react';

function AddEntryModalButton() {
  return (
    <button
      type="button"
      className="btn btn-success"
      data-bs-toggle="modal"
      data-bs-target="#entryModal"
    >
      Add Entry
    </button>
  );
}

function EntryForm() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [notes, setNotes] = useState('');

  // const onSubmitForm = async (e) => {
  //   e.preventDefault();
  // }

  return (
    // onSubmit={onSubmitForm}
    <form id="entry-form">
      {/* Title */}
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          type="input"
          className="form-control"
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          required
        />
      </div>

      {/* Category */}
      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        <select
          className="form-select"
          id="category"
          value={category === 'All' ? '' : category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Category select"
          required
        >
          <option value="" hidden>
            Category
          </option>
          <option value="Movies">Movies</option>
          <option value="TV">TV</option>
          <option value="Anime">Anime</option>
          <option value="Manga">Manga</option>
          <option value="Games">Games</option>
          <option value="Books">Books</option>
        </select>
      </div>

      {/* Status */}
      <div className="mb-3">
        <label htmlFor="status" className="form-label">
          Status
        </label>
        <select
          className="form-select"
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Status select"
          required
        >
          <option value="" hidden>
            Status
          </option>
          <option value="Ongoing">Ongoing</option>
          <option value="Planning">Planning</option>
        </select>
      </div>

      {/* Priority */}
      <div className="mb-3">
        <label htmlFor="priority" className="form-label">
          Priority
        </label>
        <select
          className="form-select"
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          aria-label="Priority select"
          required
        >
          <option value="" hidden>
            Priority
          </option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Notes */}
      <div className="mb-3">
        <label htmlFor="notes" className="form-label">
          Notes
        </label>
        <textarea
          className="form-control"
          id="notes"
          rows="3"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
      </div>
    </form>
  );
}

function EntryModal() {
  return (
    <div
      className="modal fade mt-5"
      id="entryModal"
      tabIndex="-1"
      aria-labelledby="entryLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog mt-5">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="entryModalLabel">
              Edit Entry
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <EntryForm />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="submit" form="entry-form" className="btn btn-primary">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export {AddEntryModalButton};
export default EntryModal;
