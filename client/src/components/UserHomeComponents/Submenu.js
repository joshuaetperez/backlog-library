import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

function Submenu(props) {
  const {sortID, setTimeToSort, setSortID} = props.sortData;
  const {statusID, priorityID, setStatusID, setPriorityID} = props.filterData;

  const onResetFilterButtonClick = () => {
    setStatusID(0);
    setPriorityID(0);
  };

  return (
    <Container className="p-0 mb-3">
      {/* Sort Select */}
      <Form.Group className="mb-3" controlId="sort">
        <h5 className="text-muted">Sort</h5>
        <Form.Select
          value={sortID.toString()}
          onChange={(e) => {
            setSortID(parseInt(e.target.value));
            setTimeToSort(true);
          }}
          aria-label="Sort select"
        >
          <option value="1">Title</option>
          <option value="2">Priority</option>
          <option value="3">Type</option>
        </Form.Select>
      </Form.Group>

      {/* Filters */}
      <div className="mb-3">
        <h5 className="text-muted">Filters</h5>
        <Form.Group controlId="filters">
          {/* Filter Status Sort */}
          <Form.Select
            className="mb-2"
            value={statusID}
            onChange={(e) => setStatusID(parseInt(e.target.value))}
            aria-label="Status filter select"
            required
          >
            <option value="" hidden>
              Status
            </option>
            <option value="1">Ongoing</option>
            <option value="2">Planning</option>
          </Form.Select>
          {/* Filter Priority Sort */}
          <Form.Select
            value={priorityID}
            onChange={(e) => setPriorityID(parseInt(e.target.value))}
            aria-label="Priority filter select"
            required
          >
            <option value="" hidden>
              Priority
            </option>
            <option value="1">High</option>
            <option value="2">Medium</option>
            <option value="3">Low</option>
          </Form.Select>
        </Form.Group>
        {/* Reset Filters Button */}
        <div className="d-grid gap-2 col-6 my-3 mx-auto">
          <Button
            type="button"
            variant="info"
            onClick={onResetFilterButtonClick}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Random Entry */}
      <div className="mb-3">
        <h5 className="text-muted">Random</h5>
        <p className="mb-2">
          Randomizer takes current category and filters (if any) into account
        </p>
        <Button type="button" variant="info" className="d-flex">
          <span className="material-icons">shuffle</span>
        </Button>
      </div>
    </Container>
  );
}

export default Submenu;
