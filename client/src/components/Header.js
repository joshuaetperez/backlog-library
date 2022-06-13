import {useContext} from 'react';
import {Link} from 'react-router-dom';
import {myContext} from './Context';

function Header() {
  const onLogOut = async () => {
    try {
      await fetch('http://localhost:5000/logout', {
        method: 'DELETE',
        credentials: 'include',
      });
      window.location = '/';
    } catch (err) {
      console.error(err.message);
    }
  };

  const isUserLoggedIn = useContext(myContext);
  return (
    <div className="navbar bg-info flex-nowrap">
      <div className="container">
        <Link to="/" className="navbar-brand fs-3 text-wrap bold">
          Backlog Library
        </Link>
        {/* isUserLoggedIn is only undefined before context is updated with fetched user data */}
        {/* In this case, don't display buttons for loading screen */}
        {isUserLoggedIn !== undefined && (
          <div className="d-flex gap-2 justify-content-center text-nowrap">
            {isUserLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={onLogOut}
                  className="btn btn-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button type="button" className="btn btn-secondary">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button type="button" className="btn btn-primary">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
