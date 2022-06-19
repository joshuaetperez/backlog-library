import {useContext, useState} from 'react';
import {myContext} from '../Context';

function AddEntryModalButton(props) {
  return (
    <button
      type="button"
      className="btn btn-success"
      onClick={props.onAddEntryButtonClick}
      data-bs-toggle="modal"
      data-bs-target="#entryModal"
    >
      Add Entry
    </button>
  );
}

function createDefaultErrorState() {
  return {
    titleLengthError: null,
    titleExistsError: null,
    categoryInvalidError: null,
    statusInvalidError: null,
    priorityInvalidError: null,
    notesLengthError: null,
  };
}

const errorMessages = {
  titleLengthErrorMessage: 'Title must contain between 1 and 100 characters',
  titleExistsErrorMessage:
    'Title already exists in this category with this user',
  categoryInvalidErrorMessage: 'Category is invalid',
  statusInvalidErrorMessage: 'Status is invalid',
  priorityInvalidErrorMessage: 'Priority is invalid',
  notesLengthErrorMessage: 'Notes cannot be more than 1000 characters',
};

function EntryForm(props) {
  const {
    entryTitle,
    entryCategory,
    entryStatus,
    entryPriority,
    entryNotes,
    setEntryTitle,
    setEntryCategory,
    setEntryStatus,
    setEntryPriority,
    setEntryNotes,
  } = props.entryData;
  const [errorObj, setErrorObj] = useState(createDefaultErrorState());
  const email = useContext(myContext).email;

  // If modal is closed, remove all error messages
  const modal = document.getElementById('entryModal');
  if (modal !== null) {
    modal.addEventListener('hide.bs.modal', function (event) {
      setErrorObj(createDefaultErrorState());
    });
  }

  const onSubmitForm = async (e) => {
    e.preventDefault();

    // TODO: Change method to POST/PUT depending on Add/Edit

    // Server-side validation
    const errorState = createDefaultErrorState();
    try {
      const body = {
        email,
        title: entryTitle,
        category: entryCategory,
        status: entryStatus,
        priority: entryPriority,
        notes: entryNotes,
      };
      const response = await fetch('http://localhost:5000/add_entry', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
        credentials: 'include',
      });
      const jsonData = await response.json();
      const errorArray = jsonData.errors;
      console.log(errorArray);

      // If there is at least one of the following errors, display error messages on the form
      if (errorArray !== undefined) {
        for (let error of errorArray) {
          switch (error.msg) {
            case errorMessages.titleLengthErrorMessage:
              errorState.titleLengthError = true;
              break;
            case errorMessages.titleExistsErrorMessage:
              errorState.titleExistsError = true;
              break;
            case errorMessages.categoryInvalidErrorMessage:
              errorState.categoryInvalidError = true;
              break;
            case errorMessages.statusInvalidErrorMessage:
              errorState.statusInvalidError = true;
              break;
            case errorMessages.priorityInvalidErrorMessage:
              errorState.priorityInvalidError = true;
              break;
            case errorMessages.notesLengthErrorMessage:
              errorState.notesLengthError = true;
              break;
            default:
              break;
          }
        }
        setErrorObj(errorState);
      } else {
        window.location = '/';
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <form id="entry-form" onSubmit={onSubmitForm}>
      {/* Title */}
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          type="input"
          className="form-control"
          id="title"
          value={entryTitle}
          maxLength="100"
          onChange={(e) => {
            setEntryTitle(e.target.value);
            setErrorObj({...errorObj, titleExistsError: null});
          }}
          required
        />
        {errorObj['titleExistsError'] !== null && (
          <div id="title-exists-error">
            <span className="material-icons">error</span>
            Title already exists in the {entryCategory} category
          </div>
        )}
      </div>

      {/* Category */}
      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        <select
          className="form-select"
          id="category"
          value={entryCategory === 'All' ? '' : entryCategory}
          onChange={(e) => {
            setEntryCategory(e.target.value);
            setErrorObj({...errorObj, categoryInvalidError: null});
          }}
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
        {errorObj['categoryInvalidError'] !== null && (
          <div id="category-invalid-error">
            <span className="material-icons">error</span>
            {errorMessages.categoryInvalidErrorMessage}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="mb-3">
        <label htmlFor="status" className="form-label">
          Status
        </label>
        <select
          className="form-select"
          id="status"
          value={entryStatus}
          onChange={(e) => {
            setEntryStatus(e.target.value);
            setErrorObj({...errorObj, statusInvalidError: null});
          }}
          aria-label="Status select"
          required
        >
          <option value="" hidden>
            Status
          </option>
          <option value="Ongoing">Ongoing</option>
          <option value="Planning">Planning</option>
        </select>
        {errorObj['statusInvalidError'] !== null && (
          <div id="status-invalid-error">
            <span className="material-icons">error</span>
            {errorMessages.statusInvalidErrorMessage}
          </div>
        )}
      </div>

      {/* Priority */}
      <div className="mb-3">
        <label htmlFor="priority" className="form-label">
          Priority
        </label>
        <select
          className="form-select"
          id="priority"
          value={entryPriority}
          onChange={(e) => {
            setEntryPriority(e.target.value);
            setErrorObj({...errorObj, priorityInvalidError: null});
          }}
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
        {errorObj['priorityInvalidError'] !== null && (
          <div id="priority-invalid-error">
            <span className="material-icons">error</span>
            {errorMessages.priorityInvalidErrorMessage}
          </div>
        )}
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
          value={entryNotes}
          maxLength="1000"
          onChange={(e) => {
            setEntryNotes(e.target.value);
            setErrorObj({...errorObj, notesLengthError: null});
          }}
        ></textarea>
        {errorObj['notesLengthError'] !== null && (
          <div id="notes-length-error">
            <span className="material-icons">error</span>
            {errorMessages.notesLengthErrorMessage}
          </div>
        )}
      </div>
    </form>
  );
}

function EntryModal(props) {
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
            <EntryForm entryData={props.entryData} />
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
