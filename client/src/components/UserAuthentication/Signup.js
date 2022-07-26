import {useState} from 'react';
import {Link} from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

function createDefaultErrorState() {
  return {
    emailExistsError: null,
    passwordLengthError: null,
    confirmationPasswordLengthError: null,
    confirmationPasswordNoMatchError: null,
  };
}

const errorMessages = {
  emailExistsErrorMessage: 'Email address is already in use',
  passwordLengthErrorMessage: 'Password must contain at least 6 characters',
  confirmationPasswordLengthErrorMessage:
    'Confirmation password must contain at least 6 characters',
  confirmationPasswordNoMatchErrorMessage:
    'Confirmation password does not match password',
};

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(null);
  const [errorObj, setErrorObj] = useState(createDefaultErrorState());

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmationPassword('');
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    // Client-side form validation
    let errorState = createDefaultErrorState();
    if (password.length < 6) errorState.passwordLengthError = true;
    if (confirmationPassword.length < 6)
      errorState.confirmationPasswordLengthError = true;
    if (password !== confirmationPassword)
      errorState.confirmationPasswordNoMatchError = true;

    // If there is at least one of the following errors, display error messages on the form without making a server request
    if (
      errorState.passwordLengthError === true ||
      errorState.confirmationPasswordLengthError === true ||
      errorState.confirmationPasswordNoMatchError === true
    ) {
      setErrorObj(errorState);
      return;
    }

    // Server-side form validation
    try {
      const body = {email, password, confirmationPassword};
      const response = await fetch('http://localhost:5000/signup', {
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
            case errorMessages.emailExistsErrorMessage:
              errorState.emailExistsError = true;
              break;
            case errorMessages.passwordLengthErrorMessage:
              errorState.passwordLengthError = true;
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
        resetForm();
        setSignupSuccess(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="bg-light d-flex flex-column flex-grow-1 py-3">
      {signupSuccess && (
        <Container>
          <Alert
            variant="success"
            onClose={() => setSignupSuccess(null)}
            dismissible
          >
            <p className="m-0 text-center">
              A verification email has been sent to your registered email
              address. Please click the verification link to continue.
            </p>
          </Alert>
        </Container>
      )}
      <Container className="bg-white my-sm-3 p-3 p-sm-5">
        <h3 className="mb-5">Sign up</h3>
        <Form onSubmit={onSubmitForm}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => {
                setErrorObj({...errorObj, emailExistsError: null});
                setEmail(e.target.value);
              }}
              required
            />
            {errorObj['emailExistsError'] !== null && (
              <Form.Text className="form-error fs-6">
                <span className="material-icons">error</span>
                {errorMessages.emailExistsErrorMessage}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => {
                setErrorObj({
                  ...errorObj,
                  passwordLengthError: null,
                  confirmationPasswordNoMatchError: null,
                });
                setPassword(e.target.value);
              }}
              required
            />
            {errorObj['passwordLengthError'] !== null && (
              <Form.Text className="form-error fs-6">
                <span className="material-icons">error</span>
                {errorMessages.passwordLengthErrorMessage}
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
            {errorObj['confirmationPasswordLengthError'] !== null && (
              <Form.Text className="form-error fs-6">
                <span className="material-icons">error</span>
                {errorMessages.confirmationPasswordLengthErrorMessage}
              </Form.Text>
            )}
            {errorObj['confirmationPasswordNoMatchError'] !== null && (
              <Form.Text className="form-error fs-6">
                <span className="material-icons">error</span>
                {errorMessages.confirmationPasswordNoMatchErrorMessage}
              </Form.Text>
            )}
          </Form.Group>
          <Button
            type="submit"
            variant="primary"
            className="rounded-pill w-100 mt-2 mb-3 p-2"
          >
            Sign up
          </Button>
          <div className="text-center">
            <Link to="/reverify" className="reverify-link">
              Resend Verification Email
            </Link>
          </div>
          <div className="text-center mt-5">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default Signup;
