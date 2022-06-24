import CategoryListGroup from './CategoryListGroup';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

function Submenu(props) {
  const {sort, setSort} = props.sortData;
  const {status, priority, setStatus, setPriority} = props.filterData;

  const onResetFilterButtonClick = () => {
    setStatus('');
    setPriority('');
  };

  return (
    <Container className="d-flex flex-column text p-0">
      {/* Category Listgroup */}
      <div className="mb-3">
        <h5 className="text-muted">Category</h5>
        <CategoryListGroup />
        <div className="d-grid gap-2 col-10 my-3 mx-auto">
          {/* Add Entry Button */}
          <Button variant="success" onClick={props.onAddEntryButtonClick}>
            Add Entry
          </Button>
        </div>
      </div>

      {/* Sort Select */}
      <Form.Group className="mb-3" controlId="sort">
        <h5 className="text-muted">Sort</h5>
        <Form.Select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort select"
        >
          <option value="Title">Title</option>
          <option value="Priority">Priority</option>
        </Form.Select>
      </Form.Group>

      {/* Filters */}
      <div className="mb-3">
        <h5 className="text-muted">Filters</h5>
        <Form.Group controlId="filters">
          {/* Filter Status Sort */}
          <Form.Select
            className="mb-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Status filter select"
            required
          >
            <option value="" hidden>
              Status
            </option>
            <option value="Ongoing">Ongoing</option>
            <option value="Planning">Planning</option>
          </Form.Select>
          {/* Filter Priority Sort */}
          <Form.Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            aria-label="Priority filter select"
            required
          >
            <option value="" hidden>
              Priority
            </option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
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
