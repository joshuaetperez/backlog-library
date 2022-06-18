import {useState} from 'react';
import {AddEntryModalButton} from './EntryModal';
import ListGroup from './ListGroup';

function Submenu(props) {
  const [isSubmenuDisplayed, setIsSubmenuDisplayed] = useState(false);
  const {sort, setSort} = props.sortData;
  const {status, priority, setStatus, setPriority} = props.filterData;

  const onSubmenuButtonClick = () => {
    isSubmenuDisplayed
      ? setIsSubmenuDisplayed(false)
      : setIsSubmenuDisplayed(true);
  };

  const onResetFilterButtonClick = () => {
    setStatus('');
    setPriority('');
  };

  return (
    <>
      <button
        type="button"
        onClick={onSubmenuButtonClick}
        className="btn btn-info d-flex justify-content-center align-self-end"
      >
        <span className="material-icons">menu</span>
      </button>
      {isSubmenuDisplayed && (
        <>
          {/* Category Listgroup */}
          <div className="mb-3">
            <h5 className="text-muted">Category</h5>
            <ListGroup categoryData={props.categoryData} />
            <div className="d-grid gap-2 col-10 my-3 mx-auto">
              {/* Add Entry Button */}
              <AddEntryModalButton />
            </div>
          </div>
          {/* const {category, setCategory} = props.categoryData; */}

          {/* Sort Select*/}
          <div className="mb-3">
            <h5 className="text-muted">Sort</h5>
            <select
              className="form-select"
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort select"
              required
            >
              <option value="Title">Title</option>
              <option value="Priority">Priority</option>
            </select>
          </div>

          {/* Filters */}
          <div className="mb-3">
            <h5 className="text-muted">Filters</h5>

            {/* Filter Status Sort */}
            <select
              className="form-select mb-2"
              id="status-filter"
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
            </select>

            {/* Filter Priority Sort */}
            <select
              className="form-select mb-2"
              id="priority-filter"
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
            </select>
            <div className="d-grid gap-2 col-6 my-3 mx-auto">
              <button
                type="button"
                onClick={onResetFilterButtonClick}
                className="btn btn-info"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Random */}
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
        </>
      )}
    </>
  );
}

export default Submenu;
