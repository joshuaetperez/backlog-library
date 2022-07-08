import {useState} from 'react';
import {removeEntry} from './entry_helpers';
import {
  createDefaultErrorState,
  createErrorState,
  errorMessages,
} from './modal_helpers';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function EditEntryForm(props) {
  const editedEntry = props.modalData.editedEntry;
  const entryID = editedEntry.entry_id;
  const [title, setTitle] = useState(editedEntry.title);
  const [categoryID, setCategoryID] = useState(editedEntry.category_id);
  const [statusID, setStatusID] = useState(editedEntry.status_id);
  const [priorityID, setPriorityID] = useState(editedEntry.priority_id);
  const [notes, setNotes] = useState(editedEntry.notes);

  const [errorObj, setErrorObj] = useState(createDefaultErrorState());

  const onSubmitForm = async (e) => {
    e.preventDefault();

    // Server-side validation
    try {
      const body = {entryID, categoryID, statusID, priorityID, title, notes};
      const response = await fetch('http://localhost:5000/edit_entry', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
        credentials: 'include',
      });
      const jsonData = await response.json();
      const errorArray = jsonData.errors;

      // If there is at least one of the following errors, display error messages on the form
      if (errorArray !== undefined) {
        const errorState = createErrorState(errorArray);
        setErrorObj(errorState);
      } else {
        // If the random entry is being edited, update changes
        const randomEntry = props.modalData.randomEntry;
        if (randomEntry !== null && randomEntry.entry_id === entryID) {
          props.modalData.setRandomEntry(jsonData);
        }

        const editedEntries = removeEntry(
          [...props.modalData.entries],
          editedEntry.entry_id
        );
        props.modalData.setEntries([...editedEntries, jsonData]);
        props.modalData.setTimeToSort(true);
        props.onHide();
        props.showAlert();
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const showErrorMessage = (error, errorMessage) => {
    if (errorObj[error] === null) return null;
    return (
      <Form.Text className="form-error fs-6">
        <span className="material-icons">error</span>
        {errorMessages[errorMessage]}
      </Form.Text>
    );
  };

  return (
    <Form onSubmit={onSubmitForm} id="edit-entry-form">
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setErrorObj({...errorObj, titleExistsError: null});
          }}
          maxLength="100"
          autoFocus
          required
        />
        {showErrorMessage('titleExistsError', 'titleExistsErrorMessage')}
      </Form.Group>
      <Form.Group className="mb-3" controlId="category">
        <Form.Label>Category</Form.Label>
        <Form.Select
          value={categoryID.toString()}
          onChange={(e) => {
            setCategoryID(parseInt(e.target.value));
            setErrorObj({...errorObj, categoryInvalidError: null});
          }}
          aria-label="Category select"
          required
        >
          <option value="" hidden>
            Category
          </option>
          <option value="1">Movies</option>
          <option value="2">TV</option>
          <option value="3">Anime</option>
          <option value="4">Manga</option>
          <option value="5">Games</option>
          <option value="6">Books</option>
        </Form.Select>
        {showErrorMessage(
          'categoryInvalidError',
          'categoryInvalidErrorMessage'
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="status">
        <Form.Label>Status</Form.Label>
        <Form.Select
          value={statusID.toString()}
          onChange={(e) => {
            setStatusID(parseInt(e.target.value));
            setErrorObj({...errorObj, statusInvalidError: null});
          }}
          aria-label="Status select"
          required
        >
          <option value="" hidden>
            Status
          </option>
          <option value="1">Ongoing</option>
          <option value="2">Planning</option>
        </Form.Select>
        {showErrorMessage('statusInvalidError', 'statusInvalidErrorMessage')}
      </Form.Group>
      <Form.Group className="mb-3" controlId="priority">
        <Form.Label>Priority</Form.Label>
        <Form.Select
          value={priorityID.toString()}
          onChange={(e) => {
            setPriorityID(parseInt(e.target.value));
            setErrorObj({...errorObj, priorityInvalidError: null});
          }}
          aria-label="Priority select"
          required
        >
          <option value="" hidden>
            Priority
          </option>
          <option value="1">High</option>
          <option value="2">Medium</option>
          <option value="3">Low</option>
        </Form.Select>
        {showErrorMessage(
          'priorityInvalidError',
          'priorityInvalidErrorMessage'
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="notes">
        <Form.Label>Notes</Form.Label>
        <Form.Control
          as="textarea"
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setErrorObj({...errorObj, notesLengthError: null});
          }}
          maxLength="1000"
          rows={3}
        />
        {showErrorMessage('notesLengthError', 'notesLengthErrorMessage')}
      </Form.Group>
    </Form>
  );
}

function EditEntryModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      aria-labelledby="edit-entry-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="edit-entry-modal">Edit Entry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EditEntryForm
          onHide={props.onHide}
          showAlert={props.showAlert}
          modalData={props.modalData}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          variant="secondary"
          onClick={props.showDeleteModal}
        >
          Delete
        </Button>
        <Button type="submit" variant="primary" form="edit-entry-form">
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditEntryModal;
