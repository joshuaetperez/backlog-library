import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import BASE_URL from '../../http';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

function Login() {
  useEffect(() => {
    document.title = 'Login - Backlog Library';
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(null);
  const [emailVerified, setEmailVerified] = useState(null);

  const onSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const body = {email, password};
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
        credentials: 'include',
      });
      if (response.status === 200) {
        const jsonData = await response.json();
        const responseText = jsonData.message;
        if (responseText === 'Login failed. Incorrect email or password.') {
          setLoginFailed(true);
        } else if (
          responseText === 'Login failed. Email has not been verified.'
        ) {
          setLoginFailed(true);
          setEmailVerified(true);
        } else {
          window.location = '/';
        }
      } else {
        console.error('Something went wrong');
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="bg-light position-relative d-flex flex-column flex-grow-1 py-3">
      {loginFailed && (
        <Container>
          <Alert
            variant="danger"
            onClose={() => {
              setLoginFailed(null);
              setEmailVerified(null);
            }}
            dismissible
          >
            {emailVerified ? (
              <p className="m-0 text-center">
                The email address of this account has not yet been verified.
                Please check your email and click on the verification link to
                continue.{' '}
                <Link to="/reverify">
                  Or click here to resend verification email.
                </Link>
              </p>
            ) : (
              <p className="m-0 text-center">
                Login failed. Incorrect email or password.
              </p>
            )}
          </Alert>
        </Container>
      )}
      <Container className="bg-white my-sm-3 p-3 p-sm-5">
        <h3 className="mb-5">Login</h3>
        <Form onSubmit={onSubmitForm}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => {
                setLoginFailed(null);
                setEmailVerified(null);
                setEmail(e.target.value);
              }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => {
                setLoginFailed(null);
                setEmailVerified(null);
                setPassword(e.target.value);
              }}
              required
            />
          </Form.Group>
          <Button
            type="submit"
            variant="primary"
            className="rounded-pill w-100 mt-2 mb-3 p-2"
          >
            Login
          </Button>
        </Form>
        <div className="text-center">
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password?
          </Link>
        </div>
        <div className="text-center mt-5">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </Container>
    </div>
  );
}

export default Login;
