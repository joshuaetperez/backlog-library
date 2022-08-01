import {useEffect, useState} from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

const emailErrorMessage =
  'Email address is either already verified or is not registered to an account';

function Reverify() {
  useEffect(() => {
    document.title = 'Email Reverification - Backlog Library';
  }, []);

  const [email, setEmail] = useState('');
  const [reverificationSuccess, setReverificationSuccess] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const resetForm = () => {
    setEmail('');
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    // Server-side form validation
    try {
      const body = {email};
      const response = await fetch(`${BASE_URL}/reverify`, {
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
        setReverificationSuccess(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="bg-light d-flex flex-column flex-grow-1 py-3">
      {reverificationSuccess && (
        <Container>
          <Alert
            variant="success"
            onClose={() => setReverificationSuccess(null)}
            dismissible
          >
            <p className="m-0 text-center">
              A verification email has been sent to your registered email
              address.
            </p>
          </Alert>
        </Container>
      )}
      <Container className="bg-white my-sm-3 p-3 p-sm-5">
        <h3 className="mb-5">Resend Verification Email</h3>
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
            Resend Email
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default Reverify;
