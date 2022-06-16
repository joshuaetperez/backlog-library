import {useState} from 'react';

function AddEntryModalButton() {
  return (
    <button
      type="button"
      className="btn btn-success"
      data-bs-toggle="modal"
      data-bs-target="#addEntryModal"
    >
      Add Entry
    </button>
  );
}

function AddEntryForm() {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  // const onSubmitForm = async (e) => {
  //   e.preventDefault();
  // }

  return (
    // onSubmit={onSubmitForm}
    <form id="add-entry-form">
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
      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        <select
          className="form-select"
          id="category"
          aria-label="Category select"
          required
        >
          <option value="" hidden>
            Category
          </option>
          <option value="movie">Movie</option>
          <option value="tv">TV</option>
          <option value="anime">Anime</option>
          <option value="manga">Manga</option>
          <option value="game">Game</option>
          <option value="book">Book</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="status" className="form-label">
          Status
        </label>
        <select
          className="form-select"
          id="status"
          aria-label="Status select"
          required
        >
          <option value="" hidden>
            Status
          </option>
          <option value="ongoing">Ongoing</option>
          <option value="planning">Planning</option>
        </select>
      </div>
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

function AddEntryModal() {
  return (
    <div
      className="modal fade mt-5"
      id="addEntryModal"
      tabIndex="-1"
      aria-labelledby="addEntryLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog mt-5">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addEntryModalLabel">
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
            <AddEntryForm />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="submit"
              form="add-entry-form"
              className="btn btn-primary"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export {AddEntryModalButton};
export default AddEntryModal;
