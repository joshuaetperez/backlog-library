import {Link} from 'react-router-dom';

function Login() {
  return (
    <div class="container-fluid bg-light d-flex flex-column justify-content-center flex-grow-1">
      <div class="container bg-white p-5">
        <h3 class="mb-5">Login</h3>
        <form>
          <div class="mb-3">
            <label for="email" class="form-label">
              Email
            </label>
            <input type="email" class="form-control" id="email" />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">
              Password
            </label>
            <input type="password" class="form-control" id="password" />
          </div>
          <div class="mt-4 mb-3 text-center">
            <button
              type="submit"
              class="btn btn-primary rounded-pill w-100 p-2"
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
