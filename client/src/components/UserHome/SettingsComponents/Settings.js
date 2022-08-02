import {useContext, useEffect, useState} from 'react';
import BASE_URL from '../../../http';
import {myContext} from '../../Context';
import {typeArray} from '../Entries/entry_helpers';
import ConfirmPasswordModal from './ConfirmPasswordModal';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function createDefaultErrorState() {
  return {
    emailInvalidError: null,
    emailExistsError: null,
    newEmailMatchesCurrentEmailError: null,
    newPasswordLengthError: null,
    newPasswordMatchesCurrentPasswordError: null,
    confirmationPasswordLengthError: null,
    confirmationPasswordNoMatchError: null,
  };
}

const errorMessages = {
  emailInvalidErrorMessage: 'Email must be a valid email address',
  emailExistsErrorMessage: 'Email address is already in use',
  newEmailMatchesCurrentEmailErrorMessage:
    'New email address cannot be the same as your current email',
  newPasswordLengthErrorMessage: 'Password must contain at least 6 characters',
  newPasswordMatchesCurrentPasswordErrorMessage:
    'New password cannot be the same as your current password',
  confirmationPasswordLengthErrorMessage:
    'Confirmation password must contain at least 6 characters',
  confirmationPasswordNoMatchErrorMessage:
    'Confirmation password does not match password',
};

function Settings() {
  useEffect(() => {
    document.title = 'Settings - Backlog Library';
  }, []);
  const user = useContext(myContext);

  const currentEmail = user.email;
  const [newEmail, setNewEmail] = useState(currentEmail);
  const [newPassword, setNewPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [deleteCategoryID, setDeleteCategoryID] = useState(-1);
  const [errorObj, setErrorObj] = useState(createDefaultErrorState());

  // Modal
  const [modal, setModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  // Alert
  const [alert, setAlert] = useState(null);
  const [alertError, setAlertError] = useState(null);
  useEffect(() => {
    const alertStates = ['Change Email', 'Change Password', 'Delete Entries'];
    if (alertStates.includes(alert)) {
      setTimeout(() => {
        setAlert(null);
        setAlertError(null);
      }, 5000);
    }
  }, [alert, alertError]);

  const changeEmail = async () => {
    try {
      const body = {newEmail};
      const response = await fetch(`${BASE_URL}/user/change-email`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
        credentials: 'include',
      });
      if (response.status === 200) {
        const jsonData = await response.json();
        const responseText = jsonData.message;
        if (
          responseText ===
          'Change Email failed: New email cannot be the same as your current email'
        ) {
          setErrorObj({
            ...errorObj,
            newEmailMatchesCurrentEmailError: true,
          });
          setAlert('Change Email');
          setAlertError(true);
        } else if (
          responseText === 'Change Email failed: New email is already taken'
        ) {
          setErrorObj({
            ...errorObj,
            emailExistsError: true,
          });
          setAlert('Change Email');
          setAlertError(true);
        } else if (responseText === 'Received change email request') {
          await fetch(`${BASE_URL}/logout`, {
            method: 'DELETE',
            credentials: 'include',
          });
          window.location = '/';
        }
      } else if (response.status === 400) {
        const jsonData = await response.json();
        const errorArray = jsonData.errors;
        // If there is at least one of the following errors, display error messages on the form
        const errorState = createDefaultErrorState();
        for (const error of errorArray) {
          switch (error.msg) {
            case errorMessages.emailInvalidErrorMessage:
              errorState.emailInvalidError = true;
              break;
            case errorMessages.newPasswordLengthErrorMessage:
              errorState.newPasswordLengthError = true;
              break;
            default:
              break;
          }
        }
        setErrorObj(errorState);
      } else {
        console.error('Something went wrong');
      }
    } catch (err) {
      console.error(err);
    }
  };
  const changePassword = async () => {
    try {
      const body = {newPassword, confirmationPassword};
      const response = await fetch(`${BASE_URL}/user/change-password`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
        credentials: 'include',
      });
      if (response.status === 200) {
        const jsonData = await response.json();
        const responseText = jsonData.message;
        if (
          responseText ===
          'Change Password failed: New password cannot be the same as your old password'
        ) {
          setErrorObj({
            ...errorObj,
            newPasswordMatchesCurrentPasswordError: true,
          });
          setAlert('Change Password');
          setAlertError(true);
        } else if (responseText === 'Password has been changed successfully!') {
          await fetch(`${BASE_URL}/logout`, {
            method: 'DELETE',
            credentials: 'include',
          });
          window.location = '/login';
        }
      } else if (response.status === 400) {
        const jsonData = await response.json();
        const errorArray = jsonData.errors;
        // If there is at least one of the following errors, display error messages on the form
        const errorState = createDefaultErrorState();
        for (const error of errorArray) {
          switch (error.msg) {
            case errorMessages.newPasswordLengthErrorMessage:
              errorState.newPasswordLengthError = true;
              break;
            case errorMessages.confirmationPasswordLengthErrorMessage:
              errorState.confirmationPasswordLengthError = true;
              break;
            case errorMessages.confirmationPasswordNoMatchErrorMessage:
              errorState.confirmationPasswordNoMatchError = true;
              break;
            default:
              break;
          }
        }
        setErrorObj(errorState);
      } else {
        console.error('Something went wrong');
      }
    } catch (err) {
      console.error(err);
    }
  };
  const deleteEntries = async () => {
    try {
      await fetch(
        `${BASE_URL}/delete-entries/${user.userID}/${deleteCategoryID}`,
        {
          method: 'DELETE',
        }
      );
      setAlert('Delete Entries');
    } catch (err) {
      console.error(err);
    }
  };
  const deleteAccount = async () => {
    try {
      console.log(user);
      await fetch(`${BASE_URL}/delete-account/${user.userID}`, {
        method: 'DELETE',
      });
      window.location = '/';
    } catch (err) {
      console.error(err);
    }
  };

  const onButtonClick = (e, action) => {
    e.preventDefault();
    if (action === 'Change Email') {
      // Client-side form validation
      const errorState = createDefaultErrorState();
      if (newEmail === currentEmail)
        errorState.newEmailMatchesCurrentEmailError = true;

      // If there is an errors, display error message on the form
      if (errorState.newEmailMatchesCurrentEmailError === true) {
        setErrorObj(errorState);
        return;
      }

      setModal(true);
      setModalData({
        title: 'Change Email',
        bodyText:
          'Please enter your current password to confirm changing to a new email address. A verification email will be sent to your new email address which will contain a verification link that only lasts 24 hours.',
        buttonText: 'Change email',
        onConfirmation: () => {
          changeEmail();
          setModal(null);
        },
      });
    } else if (action === 'Change Password') {
      // Client-side form validation
      const errorState = createDefaultErrorState();
      if (newPassword.length < 6) errorState.newPasswordLengthError = true;
      if (confirmationPassword.length < 6)
        errorState.confirmationPasswordLengthError = true;
      if (newPassword !== confirmationPassword)
        errorState.confirmationPasswordNoMatchError = true;

      // If there is at least one of the following errors, display error messages on the form
      if (
        errorState.newPasswordLengthError === true ||
        errorState.confirmationPasswordLengthError === true ||
        errorState.confirmationPasswordNoMatchError === true
      ) {
        setErrorObj(errorState);
        return;
      }

      setModal(true);
      setModalData({
        title: 'Change Password',
        bodyText:
          'Please enter your current password to confirm changing to a new password. You will be logged out if password change is successful.',
        buttonText: 'Change password',
        onConfirmation: () => {
          changePassword();
          setModal(null);
        },
      });
    } else if (action === 'Delete Entries') {
      setModal(true);
      setModalData({
        title: 'Delete Entries',
        bodyText: `Please enter your password to confirm deletion of ${
          deleteCategoryID === 0
            ? 'ALL entries (from every category).'
            : `all entries in the ${typeArray[deleteCategoryID - 1]} category.`
        }`,
        buttonText: 'Delete entries',
        onConfirmation: () => {
          deleteEntries();
          setModal(null);
        },
      });
    } else if (action === 'Delete Account') {
      setModal(true);
      setModalData({
        title: 'Delete Account',
        bodyText:
          'Please enter your password to confirm deletion of your account.',
        buttonText: 'Delete my account',
        onConfirmation: () => {
          deleteAccount();
          setModal(null);
        },
      });
    }
  };

  const displayAlert = () => {
    if (alert === null) return null;
    if (alertError === true) {
      return (
        <Container className="alert-container position-fixed start-50 translate-middle mt-sm-3">
          <Alert variant="danger" onClose={() => setAlert(null)} dismissible>
            <p className="m-0 text-center">{alertText()}</p>
          </Alert>
        </Container>
      );
    }
    return (
      <Container className="alert-container position-fixed start-50 translate-middle mt-sm-3">
        <Alert variant="success" onClose={() => setAlert(null)} dismissible>
          <p className="m-0 text-center">{alertText()}</p>
        </Alert>
      </Container>
    );
  };

  const alertText = () => {
    if (
      alert === 'Change Email' &&
      errorObj.newEmailMatchesCurrentEmailError === true
    ) {
      return `Email change failed: ${errorMessages.newEmailMatchesCurrentEmailErrorMessage}.`;
    } else if (alert === 'Change Email' && errorObj.emailExistsError === true) {
      return `Email change failed: ${errorMessages.emailExistsErrorMessage}.`;
    } else if (alert === 'Change Password') {
      return `Password change failed: ${errorMessages.newPasswordMatchesCurrentPasswordErrorMessage}.`;
    } else if (alert === 'Delete Entries') {
      return `${
        deleteCategoryID === 0
          ? 'All entries have been deleted successfully!'
          : `All entries in the ${
              typeArray[deleteCategoryID - 1]
            } category have been deleted successfully!`
      }`;
    }
    return 'Something unexpected happened...';
  };

  const showErrorMessage = (error, errorMessage) => {
    if (errorObj[error] === null) return null;
    return (
      <Form.Text className="form-error fs-6">
        <span className="material-icons">error</span>
        {errorMessages[errorMessage]}
      </Form.Text>
    );
  };

  return (
    <div className="bg-light d-flex flex-column flex-grow-1 py-3">
      <ConfirmPasswordModal
        show={modal !== null}
        onHide={() => setModal(null)}
        showAlert={(value) => setAlert(value)}
        modalData={modalData}
      />
      {displayAlert()}
      <Container className="bg-white my-sm-3 p-3 p-sm-5">
        <h3 className="mb-5">User Settings</h3>

        {/* Change Email */}
        <Container className="p-0 mb-md-5 mb-4">
          <Form onSubmit={(e) => onButtonClick(e, 'Change Email')}>
            <Form.Group as={Row} className="mb-3" controlId="new-email">
              <Form.Label column md={3} className="fw-bold">
                Change Email
              </Form.Label>
              <Col md={9}>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={newEmail}
                  onChange={(e) => {
                    setErrorObj({
                      ...errorObj,
                      newEmailMatchesCurrentEmailError: null,
                    });
                    setNewEmail(e.target.value);
                  }}
                  required
                />
                {showErrorMessage(
                  'emailInvalidError',
                  'emailInvalidErrorMessage'
                )}
                {showErrorMessage(
                  'emailExistsError',
                  'emailExistsErrorMessage'
                )}
                {showErrorMessage(
                  'newEmailMatchesCurrentEmailError',
                  'newEmailMatchesCurrentEmailErrorMessage'
                )}
              </Col>
            </Form.Group>
            <Row>
              <Col md={3}></Col>
              <Col md={9}>
                <Button type="submit" variant="primary">
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>

        {/* Change Password */}
        <Container className="p-0 mb-5">
          <Form onSubmit={(e) => onButtonClick(e, 'Change Password')}>
            <Form.Group as={Row} className="mb-3" controlId="new-password">
              <Form.Label column md={3} className="fw-bold">
                Change Password
              </Form.Label>
              <Col md={9}>
                <Form.Control
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => {
                    setErrorObj({
                      ...errorObj,
                      newPasswordLengthError: null,
                      newPasswordMatchesCurrentPasswordError: null,
                      confirmationPasswordNoMatchError: null,
                    });
                    setNewPassword(e.target.value);
                  }}
                  required
                />
                {showErrorMessage(
                  'newPasswordLengthError',
                  'newPasswordLengthErrorMessage'
                )}
                {showErrorMessage(
                  'newPasswordMatchesCurrentPasswordError',
                  'newPasswordMatchesCurrentPasswordErrorMessage'
                )}
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              className="mb-3"
              controlId="confirm-new-password"
            >
              <Col md={3}></Col>
              <Col md={9}>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmationPassword}
                  onChange={(e) => {
                    setErrorObj({
                      ...errorObj,
                      confirmationPasswordLengthError: null,
                      confirmationPasswordNoMatchError: null,
                    });
                    setConfirmationPassword(e.target.value);
                  }}
                  required
                />
                {showErrorMessage(
                  'confirmationPasswordLengthError',
                  'confirmationPasswordLengthErrorMessage'
                )}
                {showErrorMessage(
                  'confirmationPasswordNoMatchError',
                  'confirmationPasswordNoMatchErrorMessage'
                )}
              </Col>
            </Form.Group>
            <Row>
              <Col md={3}></Col>
              <Col md={9}>
                <Button type="submit" variant="primary">
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>

        <hr></hr>

        {/* Delete Entries */}
        <Container className="p-0 my-md-5 mt-4 mb-5">
          <Form onSubmit={(e) => onButtonClick(e, 'Delete Entries')}>
            <Form.Group as={Row} className="mb-3" controlId="delete-entries">
              <Form.Label column md={3} className="fw-bold">
                Delete Entries
              </Form.Label>
              <Col md={9}>
                <Form.Select
                  value={deleteCategoryID}
                  onChange={(e) =>
                    setDeleteCategoryID(parseInt(e.target.value))
                  }
                  aria-label="Delete category select"
                  required
                >
                  <option value="" hidden>
                    Select category...
                  </option>
                  <option value="0">All Categories</option>
                  <option value="1">Movies</option>
                  <option value="2">TV</option>
                  <option value="3">Anime</option>
                  <option value="4">Manga</option>
                  <option value="5">Games</option>
                  <option value="6">Books</option>
                </Form.Select>
              </Col>
            </Form.Group>
            <Row>
              <Col md={3}></Col>
              <Col md={9}>
                <p>
                  Clicking on the "Delete Entries" button will permanently
                  delete all entries in the selected category.
                </p>
                <Button type="submit" variant="danger">
                  Delete Entries
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>

        <hr></hr>

        {/* Delete Account */}
        <Container className="p-0 my-md-5 mt-4 mb-5">
          <Row>
            <Col md={3} className="fw-bold">
              Delete Account
            </Col>
            <Col md={9}>
              <p>
                Clicking on the "Delete User Account" button will permanently
                delete all your account data.
              </p>
              <Button
                type="button"
                variant="danger"
                onClick={(e) => onButtonClick(e, 'Delete Account')}
              >
                Delete User Account
              </Button>
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  );
}

export default Settings;
