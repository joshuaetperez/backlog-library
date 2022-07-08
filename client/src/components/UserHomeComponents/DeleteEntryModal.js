import {useState} from 'react';
import {removeEntry} from './entry_helpers';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function DeleteEntryModal(props) {
  const [errorExists, setErrorExists] = useState(false);

  const onConfirmation = async () => {
    const entryID = props.modalData.editedEntry.entry_id;
    try {
      await fetch('http://localhost:5000/delete_entry/' + entryID, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
      });
      // If the random entry is being edited, update changes
      const randomEntry = props.modalData.randomEntry;
      if (randomEntry !== null && randomEntry.entry_id === entryID) {
        props.modalData.setRandomEntry(null);
      }

      const editedEntries = removeEntry([...props.modalData.entries], entryID);
      props.modalData.setEntries(editedEntries);
      props.modalData.setTimeToSort(true);
      props.onHide();
      props.showAlert();
    } catch (err) {
      setErrorExists(true);
      console.error(err.message);
    }
  };

  const showErrorMessage = () => {
    if (!errorExists) return null;
    return (
      <div className="form-error fs-6">
        <span className="material-icons">error</span>
        An error occurred. Unable to delete entry.
      </div>
    );
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onCancel}
      aria-labelledby="delete-entry-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="delete-entry-modal">Delete Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete this entry? {showErrorMessage()}
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="light" onClick={props.onCancel}>
          Cancel
        </Button>
        <Button type="button" variant="primary" onClick={onConfirmation}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteEntryModal;
