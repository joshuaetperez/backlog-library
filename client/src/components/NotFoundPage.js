import {useEffect} from 'react';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

function NotFoundPage() {
  useEffect(() => {
    document.title = '404 Not Found - Backlog Library';
  }, []);

  return (
    <Container
      className="bg-light d-flex flex-grow-1 justify-content-center py-3"
      fluid
    >
      <Card className="card-height-404 bg-info my-3 px-lg-5 rounded-4">
        <Card.Body className="text-center">
          <Card.Title className="my-3 fs-1">404 Page Not Found</Card.Title>
          <Card.Subtitle className="mb-4 fs-4 text-muted">
            The page you are trying to access does not exist!
          </Card.Subtitle>
        </Card.Body>
        <Link to="/" className="mb-lg-4">
          <Button type="button" variant="primary" className="rounded-4 w-100">
            Go back to home page
          </Button>
        </Link>
      </Card>
    </Container>
  );
}

export default NotFoundPage;
