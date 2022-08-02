import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import BASE_URL from '../../http';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

const emailErrorMessage =
  'Email address is either not verified or is not registered to an account';

function ForgotPassword() {
  useEffect(() => {
    document.title = 'Reset Password - Backlog Library';
  }, []);

  const [email, setEmail] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const resetForm = () => {
    setEmail('');
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    // Server-side form validation
    try {
      const body = {email};
      const response = await fetch(`${BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      });
      const jsonData = await response.json();
      const errorArray = jsonData.errors;
      // If there is an error concerning the email, display error message on the form
      if (errorArray !== undefined && errorArray[0].msg === emailErrorMessage) {
        setEmailError(true);
      } else {
        resetForm();
        setRequestSuccess(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="bg-light d-flex flex-column flex-grow-1 py-3">
      {requestSuccess && (
        <Container>
          <Alert
            variant="success"
            onClose={() => setRequestSuccess(null)}
            dismissible
          >
            <p className="m-0 text-center">
              A reset password email has been sent to the provided email
              address.
            </p>
          </Alert>
        </Container>
      )}
      <Container className="bg-white my-sm-3 p-3 p-sm-5">
        <h3 className="mb-5">Forgot Password?</h3>
        <Form onSubmit={onSubmitForm}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => {
                setEmailError(null);
                setEmail(e.target.value);
              }}
              required
            />
            {emailError !== null && (
              <Form.Text className="form-error fs-6">
                <span className="material-icons">error</span>
                {emailErrorMessage}
              </Form.Text>
            )}
          </Form.Group>
          <Button
            type="submit"
            variant="primary"
            className="rounded-pill w-100 mt-2 mb-3 p-2"
          >
            Send Reset Request
          </Button>
        </Form>
        <div className="text-center mt-5">
          Remembered your password? <Link to="/login">Login</Link>
        </div>
      </Container>
    </div>
  );
}

export default ForgotPassword;
