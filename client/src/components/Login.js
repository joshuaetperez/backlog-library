import {useState} from 'react';
import {Link} from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasLoginFailed, setHasLoginFailed] = useState(false);

  const onSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const body = {email, password};
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
        credentials: 'include',
      });
      if (response.status === 401) {
        setHasLoginFailed(true);
      } else {
        window.location = '/';
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="bg-light d-flex flex-column flex-grow-1 py-3">
      {hasLoginFailed && (
        <div className="container mt-md-3">
          <Alert
            variant="danger"
            onClose={() => setHasLoginFailed(false)}
            dismissible
          >
            <p className="m-0 text-center">
              Login failed. Incorrect email or password.
            </p>
          </Alert>
        </div>
      )}
      <div className="container bg-white my-md-3 p-3 p-md-5">
        <h3 className="mb-5">Login</h3>
        <Form onSubmit={onSubmitForm}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => {
                setHasLoginFailed(false);
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
                setHasLoginFailed(false);
                setPassword(e.target.value);
              }}
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="rounded-pill w-100 mt-2 mb-3 p-2"
          >
            Login
          </Button>
        </Form>
        <div className="text-center mb-5 text-muted">Forgot Password?</div>
        <div className="text-center">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
