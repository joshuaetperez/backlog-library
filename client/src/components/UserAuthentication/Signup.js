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
    confirmPasswordLengthError: null,
    confirmPasswordNoMatchError: null,
  };
}

const errorMessages = {
  emailExistsErrorMessage: 'Email address is already in use',
  passwordLengthErrorMessage: 'Password must contain at least 6 characters',
  confirmPasswordLengthErrorMessage:
    'Confirmation password must contain at least 6 characters',
  confirmPasswordNoMatchErrorMessage:
    'Confirmation password does not match password',
};

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(null);
  const [errorObj, setErrorObj] = useState(createDefaultErrorState());

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    // Client-side form validation
    let errorState = createDefaultErrorState();
    if (password.length < 6) errorState.passwordLengthError = true;
    if (confirmPassword.length < 6)
      errorState.confirmPasswordLengthError = true;
    if (password !== confirmPassword)
      errorState.confirmPasswordNoMatchError = true;

    // If there is at least one of the following errors, display error messages on the form without making a server request
    if (
      errorState.passwordLengthError === true ||
      errorState.confirmPasswordLengthError === true ||
      errorState.confirmPasswordNoMatchError === true
    ) {
      setErrorObj(errorState);
      return;
    }

    // Server-side form validation
    errorState = createDefaultErrorState();
    try {
      const body = {email, password, confirmPassword};
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
            case errorMessages.confirmPasswordLengthErrorMessage:
              errorState.confirmPasswordLengthError = true;
              break;
            case errorMessages.confirmPasswordNoMatchErrorMessage:
              errorState.confirmPasswordNoMatchError = true;
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
        <Container className="alert-container position-fixed start-50 translate-middle mt-sm-5">
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
              value={confirmPassword}
              onChange={(e) => {
                setErrorObj({
                  ...errorObj,
                  confirmPasswordLengthError: null,
                  confirmPasswordNoMatchError: null,
                });
                setConfirmPassword(e.target.value);
              }}
              required
            />
            {errorObj['confirmPasswordLengthError'] !== null && (
              <Form.Text className="form-error fs-6">
                <span className="material-icons">error</span>
                {errorMessages.confirmPasswordLengthErrorMessage}
              </Form.Text>
            )}
            {errorObj['confirmPasswordNoMatchError'] !== null && (
              <Form.Text className="form-error fs-6">
                <span className="material-icons">error</span>
                {errorMessages.confirmPasswordNoMatchErrorMessage}
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
          <div className="text-center mt-5">
            <Link to="/reverify" className="reverify-link">
              Resend Verification Email
            </Link>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default Signup;
