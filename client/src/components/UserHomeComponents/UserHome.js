import ListGroup from './ListGroup';

function UserHome() {
  return (
    <div className="container-fluid bg-light py-3 d-flex flex-grow-1 justify-content-center">
      <div className="container my-3 p-0 bg-info bg-gradient">
        <ListGroup />
      </div>
    </div>
  );
}

export default UserHome;
