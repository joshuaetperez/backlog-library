import {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';

function ChangeEmailStatus() {
  useEffect(() => {
    document.title = 'Change Email - Backlog Library';
  }, []);

  // "/change-email/" is 14 characters long
  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = useState(useLocation().pathname.substring(14));
  const [changeSuccess, setChangeSuccess] = useState(null);

  useEffect(() => {
    async function changeEmail(e) {
      try {
        const response = await fetch(
          `http://localhost:5000/change-email/${token}`,
          {
            method: 'POST',
          }
        );
        if (response.status === 200) {
          const jsonData = await response.json();
          const responseText = jsonData.message;
          if (responseText === 'Password changed successfully!') {
            setChangeSuccess(true);
          }
        } else {
          setChangeSuccess(false);
        }
      } catch (err) {
        console.error(err.message);
      }
    }

    async function checkToken() {
      try {
        const response = await fetch(
          `http://localhost:5000/check-token/${token}`
        );
        if (response.status === 200) {
          const jsonData = await response.json();
          const responseText = jsonData.message;
          if (responseText === 'Valid token') {
            await changeEmail();
          } else {
            setChangeSuccess(false);
          }
        } else {
          console.error('Something went wrong');
        }
      } catch (err) {
        console.error(err.message);
      }
    }
    checkToken();
  }, [token]);

  useEffect(() => {
    if (changeSuccess) {
      setTimeout(() => {
        window.location = '/login';
      }, 5000);
    }
  }, [changeSuccess]);

  const redirectPage = (
    <div className="bg-light d-flex flex-column flex-grow-1 py-3">
      <Container>
        <Alert variant="success">
          <p className="m-0 text-center">
            Email was changed successfully! You will be redirected to the login
            page shortly.{' '}
            <Link to="/login">Or click here to go there now.</Link>
          </p>
        </Alert>
      </Container>
    </div>
  );
  const invalidPage = (
    <div className="bg-light d-flex flex-column flex-grow-1 py-3">
      <Container>
        <Alert variant="danger">
          <p className="m-0 text-center">
            Your change email verification link has either expired or is
            invalid.{' '}
            <Link to="/login">Click here to go to the login page.</Link>
          </p>
        </Alert>
      </Container>
    </div>
  );

  const displayPage = () => {
    if (changeSuccess === null) {
      return (
        <Container fluid className="bg-light d-flex flex-grow-1"></Container>
      );
    } else if (changeSuccess === true) {
      return redirectPage;
    } else {
      return invalidPage;
    }
  };

  return displayPage();
}

export default ChangeEmailStatus;
