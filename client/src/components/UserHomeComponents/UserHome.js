import {AddEntryModalButton} from './EntryModal';
import ListGroup from './ListGroup';

function UserHome() {
  return (
    <>
      <div className="container-fluid bg-light py-3 d-flex flex-grow-1 justify-content-center">
        <div className="container my-3 p-0">
          <h5 className="text-muted">Category</h5>
          <ListGroup />
          <div className="d-grid gap-2 col-10 my-3 mx-auto">
            <AddEntryModalButton />
          </div>
          <h5 className="text-muted">Sort</h5>
          <div className="mb-3">
            <select
              className="form-select"
              id="sort"
              defaultValue="title"
              aria-label="Sort select"
              required
            >
              <option value="title">Title</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          <div className="mb-3">
            <h5 className="text-muted">Filters</h5>
            <select
              className="form-select mb-2"
              id="status-filter"
              aria-label="Status filter select"
              required
            >
              <option value="" hidden>
                Status
              </option>
              <option value="ongoing">Ongoing</option>
              <option value="planning">Planning</option>
            </select>
            <select
              className="form-select mb-2"
              id="priority-filter"
              aria-label="Priority filter select"
              required
            >
              <option value="" hidden>
                Priority
              </option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <div className="d-grid gap-2 col-6 my-3 mx-auto">
              <button type="button" className="btn btn-info">
                Reset Filters
              </button>
            </div>
          </div>
          <div className="mb-3">
            <h5 className="text-muted">Random</h5>
            <p className="mb-2">
              Randomizer takes current category and filters (if any) into
              account
            </p>
            <button
              type="button"
              className="btn btn-info d-flex justify-content-center"
            >
              <span className="material-icons">shuffle</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserHome;
