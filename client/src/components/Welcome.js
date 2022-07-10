import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Welcome() {
  return (
    <Container
      className="bg-light d-flex flex-grow-1 justify-content-center py-3"
      fluid
    >
      <Card className="card-height bg-info my-3 px-lg-5 rounded-4">
        <Card.Body className="text-center">
          <Card.Title className="my-3 fs-2">Your Personal Backlog</Card.Title>
          <Card.Subtitle className="mb-4 fs-4 text-muted">
            Keep track of what you want to do next!
          </Card.Subtitle>
          <p className="card-text fs-4 text-muted">
            Backlog Library can be used to keep track of the following
            categories:
          </p>
          <Container className="fs-4 fw-semibold pb-5">
            <Row className="py-1">
              <Col>Movies</Col>
              <Col>TV Shows</Col>
            </Row>
            <Row className="py-1">
              <Col>Anime</Col>
              <Col>Manga</Col>
            </Row>
            <Row className="py-1">
              <Col>Games</Col>
              <Col>Books</Col>
            </Row>
          </Container>
        </Card.Body>
        <Link to="/signup" className="mb-lg-4">
          <Button type="button" variant="primary" className="rounded-4 w-100">
            Make an account!
          </Button>
        </Link>
      </Card>
    </Container>
  );
}

export default Welcome;
