import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

function createDefaultErrorState() {
  return {
    passwordLengthError: null,
    passwordIncorrectError: null,
  };
}

const errorMessages = {
  passwordLengthErrorMessage: 'Password must contain at least 6 characters',
  passwordIncorrectErrorMessage: 'Password is incorrect',
};

function ConfirmPasswordForm(props) {
  const [password, setPassword] = useState('');
  const [errorObj, setErrorObj] = useState(createDefaultErrorState());

  const onSubmitForm = async (e) => {
    e.preventDefault();

    // Client-side form validation
    const errorState = createDefaultErrorState();
    if (password.length < 6) errorState.passwordLengthError = true;

    // If there is at least one of the following errors, display error messages on the form without making a server request
    if (errorState.passwordLengthError === true) {
      setErrorObj(errorState);
      return;
    }

    // Server-side validation
    try {
      const body = {password};
      const response = await fetch(`${BASE_URL}/user/confirm-password`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
        credentials: 'include',
      });

      if (response.status === 200) {
        const jsonData = await response.json();
        const responseText = jsonData.message;
        if (responseText === 'Password is correct') {
          props.onConfirmation();
        } else if (responseText === 'Password is incorrect') {
          setErrorObj({...errorState, passwordIncorrectError: true});
        }
      } else if (response.status === 400) {
        const jsonData = await response.json();
        const errorArray = jsonData.errors;
        // If there is at least one of the following errors, display error messages on the form
        for (const error of errorArray) {
          switch (error.msg) {
            case errorMessages.passwordLengthErrorMessage:
              errorState.passwordLengthError = true;
              break;
            default:
              break;
          }
        }
        setErrorObj(errorState);
      } else {
        console.error('Something went wrong');
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
    <Form onSubmit={onSubmitForm} id="confirm-password-form">
      <Form.Group className="mb-3" controlId="password">
        <Form.Control
          type="password"
          value={password}
          placeholder="Confirm password"
          onChange={(e) => {
            setPassword(e.target.value);
            setErrorObj({
              ...errorObj,
              passwordLengthError: null,
              passwordIncorrectError: null,
            });
          }}
          autoFocus
          required
        />
        {showErrorMessage('passwordLengthError', 'passwordLengthErrorMessage')}
        {showErrorMessage(
          'passwordIncorrectError',
          'passwordIncorrectErrorMessage'
        )}
      </Form.Group>
    </Form>
  );
}

function ConfirmPasswordModal(props) {
  if (props.modalData === null) return;
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      aria-labelledby="confirm-password-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="confirm-password-modal">
          {props.modalData.title || 'Confirm changes'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{props.modalData.bodyText || 'Are you sure you want to do this?'}</p>
        <ConfirmPasswordForm
          onHide={props.onHide}
          showAlert={props.showAlert}
          onConfirmation={props.modalData.onConfirmation}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" variant="primary" form="confirm-password-form">
          {props.modalData.buttonText || 'Confirm'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmPasswordModal;
