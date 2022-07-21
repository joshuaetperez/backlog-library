import {useState} from 'react';
import {useLocation} from 'react-router-dom';
import {categoryArray} from '../Entries/entry_helpers';
import {
  createDefaultErrorState,
  createErrorState,
  errorMessages,
} from './modal_helpers';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function AddEntryForm(props) {
  const entryData = props.entryData;
  const [title, setTitle] = useState('');
  const [categoryID, setCategoryID] = useState(
    categoryArray.indexOf(useLocation().pathname.substring(1))
  );
  const [statusID, setStatusID] = useState(entryData.statusID);
  const [priorityID, setPriorityID] = useState(entryData.priorityID);
  const [notes, setNotes] = useState('');

  const [errorObj, setErrorObj] = useState(createDefaultErrorState());

  const onSubmitForm = async (e) => {
    e.preventDefault();

    // Server-side validation
    try {
      const body = {
        categoryID,
        statusID,
        priorityID,
        title: title.trim(),
        notes,
      };
      const response = await fetch('http://localhost:5000/add-entry', {
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
        entryData.setEntries([...entryData.entries, jsonData]);
        entryData.setTimeToSort(true);
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
    <Form onSubmit={onSubmitForm} id="add-entry-form">
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setErrorObj({...errorObj, titleExistsError: null});
          }}
          maxLength="200"
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

function AddEntryModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      aria-labelledby="add-entry-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="add-entry-modal">Add Entry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddEntryForm
          onHide={props.onHide}
          showAlert={props.showAlert}
          entryData={props.entryData}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" variant="primary" form="add-entry-form">
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddEntryModal;
