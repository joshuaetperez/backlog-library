import {useContext, useEffect, useState} from 'react';
import {myContext} from '../../Context';
import {typeArray} from '../Entries/entry_helpers';
import ConfirmPasswordModal from './ConfirmPasswordModal';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function Settings() {
  const user = useContext(myContext);

  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [deleteCategoryID, setDeleteCategoryID] = useState(-1);

  // Modal
  const [modal, setModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  // Alert
  const [alert, setAlert] = useState(null);
  useEffect(() => {
    const alertStates = ['Change Email', 'Change Password', 'Delete Entries'];
    if (alertStates.includes(alert)) {
      setTimeout(() => setAlert(null), 5000);
    }
  }, [alert]);

  const changeEmail = async () => {};
  const changePassword = async () => {};
  const deleteEntries = async () => {
    try {
      await fetch(
        `http://localhost:5000/delete-entries/${user.userID}/${deleteCategoryID}`,
        {
          method: 'DELETE',
          credentials: 'include',
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
      await fetch(`http://localhost:5000/user/delete-account/${user.userID}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      window.location = '/';
    } catch (err) {
      console.error(err);
    }
  };

  const onButtonClick = (e, action) => {
    e.preventDefault();
    if (action === 'Change Email') {
    } else if (action === 'Change Password') {
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

  const alertText = () => {
    if (alert === 'Change Email') {
    } else if (alert === 'Change Password') {
    } else if (alert === 'Delete Entries')
      return `${
        deleteCategoryID === 0
          ? 'All entries have been deleted successfully!'
          : `All entries in the ${
              typeArray[deleteCategoryID - 1]
            } category have been deleted successfully!`
      }`;
    else if (alert === 'Delete Entries')
      return `${
        deleteCategoryID === 0
          ? 'All entries have been deleted successfully!'
          : `All entries in the ${
              typeArray[deleteCategoryID - 1]
            } category have been deleted successfully!`
      }`;
    return 'Something successfully happened...';
  };

  return (
    <div className="bg-light d-flex flex-column flex-grow-1 py-3">
      <ConfirmPasswordModal
        show={modal !== null}
        onHide={() => setModal(null)}
        showAlert={(value) => setAlert(value)}
        modalData={modalData}
      />
      {alert !== null && (
        <Container className="alert-container position-fixed start-50 translate-middle mt-sm-3">
          <Alert variant="success" onClose={() => setAlert(null)} dismissible>
            <p className="m-0 text-center">{alertText()}</p>
          </Alert>
        </Container>
      )}
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
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
                    setNewPassword(e.target.value);
                  }}
                  required
                />
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
                  value={confirmNewPassword}
                  onChange={(e) => {
                    setConfirmNewPassword(e.target.value);
                  }}
                  required
                />
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
