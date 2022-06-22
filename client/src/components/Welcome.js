import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Welcome() {
  return (
    <div className="container-fluid bg-light py-3 d-flex flex-grow-1 justify-content-center">
      <Card className="my-3 px-lg-5 bg-info rounded-4 card-height">
        <Card.Body className="text-center">
          <Card.Title className="my-3 fs-2">Your Personal Backlog</Card.Title>
          <Card.Subtitle className="mb-4 fs-4 text-muted">
            Keep track of what you want to do next!
          </Card.Subtitle>
          <p className="card-text fs-4 text-muted">
            Backlog Library can be used to keep track of the following
            categories:
          </p>
          <Container className="fs-4 bold-m pb-5">
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
        <div className="mb-lg-4">
          <Link to="/signup">
            <Button variant="primary" className="rounded-4 w-100">
              Make an account!
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default Welcome;
