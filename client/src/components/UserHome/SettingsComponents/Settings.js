import {useState} from 'react';
import {useContext} from 'react';
import {myContext} from '../../Context';
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
  const [deleteCategory, setDeleteCategory] = useState(-1);

  const onEmailChange = () => {};
  const onPasswordChange = () => {};
  const onDeleteEntries = async (e) => {
    e.preventDefault();
    try {
      const body = {category: deleteCategory};
      const response = await fetch('http://localhost:5000/delete-entries', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
        credentials: 'include',
      });
      // Display alert saying that entries were deleted successfully
    } catch (err) {
      console.error(err);
    }
  };
  const onDeleteAccount = () => {};

  return (
    <div className="bg-light d-flex flex-column flex-grow-1 py-3">
      <Container className="bg-white my-sm-3 p-3 p-sm-5">
        <h3 className="mb-5">User Settings</h3>

        {/* Change Email */}
        <Container className="p-0 mb-md-5 mb-4">
          <Form onSubmit={onEmailChange}>
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
          <Form onSubmit={onPasswordChange}>
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
          <Form onSubmit={onDeleteEntries}>
            <Form.Group as={Row} className="mb-3" controlId="delete-entries">
              <Form.Label column md={3} className="fw-bold">
                Delete Entries
              </Form.Label>
              <Col md={9}>
                <Form.Select
                  value={deleteCategory}
                  onChange={(e) => setDeleteCategory(parseInt(e.target.value))}
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
              <Button type="button" variant="danger" onClick={onDeleteAccount}>
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
