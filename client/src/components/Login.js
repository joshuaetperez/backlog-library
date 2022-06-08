import {useState} from 'react';
import {Link} from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = {email, password};
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      });
      console.log(response);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="container-fluid bg-light d-flex flex-column justify-content-center flex-grow-1 p-0">
      <div className="container bg-white p-5">
        <h3 className="mb-5">Login</h3>
        <form onSubmit={onSubmitForm}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mt-4 mb-3 text-center">
            <button
              type="submit"
              className="btn btn-primary rounded-pill w-100 p-2"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center mb-5 text-muted">Forgot Password?</div>
        <div className="text-center">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
