import {useState} from 'react';
import {useLocation} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import {categoryArray} from './entry_helpers';

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
  const [title, setTitle] = useState('');
  const [categoryID, setCategoryID] = useState(
    categoryArray.indexOf(useLocation().pathname.substring(1))
  );
  const [statusID, setStatusID] = useState(props.modalData.statusID);
  const [priorityID, setPriorityID] = useState(props.modalData.priorityID);
  const [notes, setNotes] = useState('');

  const [errorObj, setErrorObj] = useState(createDefaultErrorState());

  const onSubmitForm = async (e) => {
    e.preventDefault();

    // TODO: Change method to POST/PUT depending on Add/Edit

    // Server-side validation
    const errorState = createDefaultErrorState();
    try {
      const body = {categoryID, statusID, priorityID, title, notes};
      const response = await fetch('http://localhost:5000/add_entry', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
        credentials: 'include',
      });
      const jsonData = await response.json();
      const errorArray = jsonData.errors;

      // If there is at least one of the following errors, display error messages on the form
      if (errorArray !== undefined) {
        for (const error of errorArray) {
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
        props.onHide();
        props.onSetShowAlert(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Form onSubmit={onSubmitForm} id="entry-form">
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
        {errorObj['titleExistsError'] !== null && (
          <Form.Text className="form-error fs-6">
            <span className="material-icons">error</span>
            {errorMessages.titleExistsErrorMessage}
          </Form.Text>
        )}
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
        {errorObj['categoryInvalidError'] !== null && (
          <Form.Text className="form-error fs-6">
            <span className="material-icons">error</span>
            {errorMessages.categoryInvalidErrorMessage}
          </Form.Text>
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
        {errorObj['statusInvalidError'] !== null && (
          <Form.Text className="form-error fs-6">
            <span className="material-icons">error</span>
            {errorMessages.statusInvalidErrorMessage}
          </Form.Text>
        )}
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
        {errorObj['priorityInvalidError'] !== null && (
          <Form.Text className="form-error fs-6">
            <span className="material-icons">error</span>
            {errorMessages.priorityInvalidErrorMessage}
          </Form.Text>
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
        {errorObj['notesLengthError'] !== null && (
          <Form.Text className="form-error fs-6">
            <span className="material-icons">error</span>
            {errorMessages.notesLengthErrorMessage}
          </Form.Text>
        )}
      </Form.Group>
    </Form>
  );
}

function EntryModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      aria-labelledby="entry-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="entry-modal">Add Entry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EntryForm
          onHide={props.onHide}
          onSetShowAlert={props.onSetShowAlert}
          modalData={props.modalData}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="secondary" onClick={props.onHide}>
          Close
        </Button>
        <Button type="submit" variant="primary" form="entry-form">
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EntryModal;
