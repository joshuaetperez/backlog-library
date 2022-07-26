import {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

function createDefaultErrorState() {
  return {
    newPasswordLengthError: null,
    confirmationPasswordLengthError: null,
    confirmationPasswordNoMatchError: null,
    newPasswordMatchesOldPasswordError: null,
  };
}

const errorMessages = {
  newPasswordLengthErrorMessage: 'Password must contain at least 6 characters',
  confirmationPasswordLengthErrorMessage:
    'Confirmation password must contain at least 6 characters',
  confirmationPasswordNoMatchErrorMessage:
    'Confirmation password does not match new password',
  newPasswordMatchesOldPasswordErrorMessage:
    'New password cannot be the same as your old password',
};

function ResetPassword() {
  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = useState(useLocation().pathname.substring(16));
  const [tokenStatus, setTokenStatus] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(null);
  const [errorObj, setErrorObj] = useState(createDefaultErrorState());

  useEffect(() => {
    async function checkToken() {
      try {
        const response = await fetch(
          `http://localhost:5000/user/check-token/${token}`,
          {
            credentials: 'include',
          }
        );
        if (response.status === 200) {
          const responseText = await response.text();
          if (responseText === 'Valid token') {
            setTokenStatus('Valid');
          } else if (responseText === 'Expired token') {
            setTokenStatus('Expired');
          } else {
            setTokenStatus('Invalid');
          }
        } else {
          console.error('Something went wrong');
        }
      } catch (err) {
        console.error(err.message);
      }
    }
    checkToken();
  }, [token]);

  useEffect(() => {
    if (resetSuccess) {
      setTimeout(() => {
        window.location = '/login';
      }, 3000);
    }
  }, [resetSuccess]);

  const onSubmitForm = async (e) => {
    e.preventDefault();

    // Client-side form validation
    let errorState = createDefaultErrorState();
    if (newPassword.length < 6) errorState.newPasswordLengthError = true;
    if (confirmationPassword.length < 6)
      errorState.confirmationPasswordLengthError = true;
    if (newPassword !== confirmationPassword)
      errorState.confirmationPasswordNoMatchError = true;

    // If there is at least one of the following errors, display error messages on the form without making a server request
    if (
      errorState.newPasswordLengthError === true ||
      errorState.confirmationPasswordLengthError === true ||
      errorState.confirmationPasswordNoMatchError === true
    ) {
      setErrorObj(errorState);
      return;
    }

    // Server-side form validation
    try {
      const body = {newPassword, confirmationPassword};
      const response = await fetch(
        `http://localhost:5000/reset-password/${token}`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(body),
          credentials: 'include',
        }
      );
      if (response.status === 200) {
        const responseText = await response.text();
        if (responseText === 'Reset Password failed: Invalid token') {
          setTokenStatus('Invalid');
          setResetSuccess(false);
        } else if (responseText === 'Reset Password failed: Expired token') {
          setTokenStatus('Expired');
          setResetSuccess(false);
        } else if (
          responseText ===
          'Reset Password failed: New password cannot be the same as your old password'
        ) {
          setErrorObj({
            ...errorObj,
            newPasswordMatchesOldPasswordError: true,
          });
          setResetSuccess(false);
        } else if (responseText === 'Reset Password successfully!') {
          setResetSuccess(true);
        } else {
          console.log('Something went wrong');
        }
      } else if (response.status === 400) {
        const jsonData = await response.json();
        const errorArray = jsonData.errors;
        // If there is at least one of the following errors, display error messages on the form
        for (const error of errorArray) {
          switch (error.msg) {
            case errorMessages.newPasswordLengthErrorMessage:
              errorState.newPasswordLengthError = true;
              break;
            case errorMessages.confirmationPasswordLengthErrorMessage:
              errorState.confirmationPasswordLengthError = true;
              break;
            case errorMessages.confirmationPasswordNoMatchErrorMessage:
              errorState.confirmationPasswordNoMatchError = true;
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

  const resetPage = (
    <div className="bg-light d-flex flex-column flex-grow-1 py-3">
      <Container className="bg-white my-sm-3 p-3 p-sm-5">
        <h3 className="mb-5">Reset Password</h3>
        <Form onSubmit={onSubmitForm}>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => {
                setErrorObj({
                  ...errorObj,
                  newPasswordLengthError: null,
                  confirmationPasswordNoMatchError: null,
                  newPasswordMatchesOldPasswordError: null,
                });
                setNewPassword(e.target.value);
              }}
              required
            />
            {showErrorMessage(
              'newPasswordLengthError',
              'newPasswordLengthErrorMessage'
            )}
            {errorObj['newPasswordMatchesOldPasswordError'] !== null && (
              <Form.Text className="form-error fs-6">
                <span className="material-icons">error</span>
                {errorMessages.newPasswordMatchesOldPasswordErrorMessage}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="confirm-password">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              type="password"
              value={confirmationPassword}
              onChange={(e) => {
                setErrorObj({
                  ...errorObj,
                  confirmationPasswordLengthError: null,
                  confirmationPasswordNoMatchError: null,
                });
                setConfirmationPassword(e.target.value);
              }}
              required
            />
            {showErrorMessage(
              'confirmationPasswordLengthError',
              'confirmationPasswordLengthErrorMessage'
            )}
            {showErrorMessage(
              'confirmationPasswordNoMatchError',
              'confirmationPasswordNoMatchErrorMessage'
            )}
          </Form.Group>
          <Button
            type="submit"
            variant="primary"
            className="rounded-pill w-100 mt-2 mb-3 p-2"
          >
            Reset password
          </Button>
          <div className="text-center mt-5">
            <Link to="/login">Back to login</Link>
          </div>
        </Form>
      </Container>
    </div>
  );

  const invalidPage = (
    <div className="bg-light d-flex flex-column flex-grow-1 py-3">
      <Container>
        <Alert variant="danger">
          <p className="m-0 text-center">
            Your reset password link has either expired or is invalid.{' '}
            <Link to="/forgot-password">
              Click here if you want to reset your password.
            </Link>
          </p>
        </Alert>
      </Container>
    </div>
  );

  const redirectPage = (
    <div className="bg-light d-flex flex-column flex-grow-1 py-3">
      <Container>
        <Alert variant="success">
          <p className="m-0 text-center">
            Password was changed successfully! You will be redirected to the
            login page shortly.{' '}
            <Link to="/login">Or click here to go there now.</Link>
          </p>
        </Alert>
      </Container>
    </div>
  );

  const displayPage = () => {
    if (tokenStatus === null) {
      return (
        <Container fluid className="bg-light d-flex flex-grow-1"></Container>
      );
    } else if (resetSuccess === true) {
      return redirectPage;
    } else if (tokenStatus === 'Valid') {
      return resetPage;
    } else {
      return invalidPage;
    }
  };

  return displayPage();
}

export default ResetPassword;
