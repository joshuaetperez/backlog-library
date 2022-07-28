import {useContext} from 'react';
import {Link} from 'react-router-dom';
import {myContext} from './Context';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Stack from 'react-bootstrap/Stack';

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

  const user = useContext(myContext);
  return (
    <Navbar bg="info">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fs-3 fw-bold text-wrap">
          Backlog Library
        </Navbar.Brand>
        {/* If on loading screen, don't show navbar buttons */}
        {user !== undefined && (
          <Stack direction="horizontal" gap={2} className="text-nowrap">
            {user ? (
              <>
                <DropdownButton
                  variant="primary"
                  title={
                    <span className="material-icons md-28">account_box</span>
                  }
                  align="end"
                >
                  <Dropdown.Item as={Link} to="/settings">
                    <span className="material-icons md-22">settings</span>
                    Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Button} onClick={onLogOut}>
                    <span className="material-icons md-22">logout</span>
                    Logout
                  </Dropdown.Item>
                </DropdownButton>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <Button type="button" variant="secondary">
                    Login
                  </Button>
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  <Button type="button" variant="primary">
                    Sign Up
                  </Button>
                </Nav.Link>
              </>
            )}
          </Stack>
        )}
      </Container>
    </Navbar>
  );
}

export default Header;
