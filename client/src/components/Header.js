import {Link} from 'react-router-dom';

function Header() {
  return (
    <div className="navbar bg-info flex-nowrap">
      <div className="container">
        <Link to="/" className="navbar-brand fs-3 text-wrap bold">
          Backlog Library
        </Link>
        <div className="d-flex gap-2 justify-content-center text-nowrap">
          <Link to="/login">
            <button type="button" class="btn btn-secondary">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button type="button" class="btn btn-primary">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
