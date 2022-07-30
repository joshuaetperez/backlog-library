import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {RandomEntryRow} from './Entries/Entries';
import {categoryArray, getRandomEntry} from './Entries/entry_helpers';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function Submenu(props) {
  const {sortID, setTimeToSort, setSortID} = props.sortData;
  const {
    entries,
    statusID,
    priorityID,
    setStatusID,
    setPriorityID,
    setEditedEntry,
    showModal,
  } = props.filterData;
  const {randomEntry, setRandomEntry} = props.randomEntryData;
  const searchText = props.searchText;
  const categoryID = categoryArray.indexOf(useLocation().pathname.substring(1));

  // Handles random entry when category or filter options are changed
  useEffect(() => {
    if (randomEntry === null) return;
    if (
      (categoryID !== 0 && randomEntry.category_id !== categoryID) ||
      (statusID !== 0 && randomEntry.status_id !== statusID) ||
      (priorityID !== 0 && randomEntry.priority_id !== priorityID)
    ) {
      setRandomEntry(null);
    }
  }, [statusID, priorityID, randomEntry, categoryID, setRandomEntry]);

  const onResetFilterButtonClick = () => {
    setStatusID(0);
    setPriorityID(0);
  };

  const onRandomButtonClick = () => {
    const filterObj = {categoryID, statusID, priorityID, searchText};
    const newRandomEntry = getRandomEntry(randomEntry, entries, filterObj);
    newRandomEntry !== undefined
      ? setRandomEntry(newRandomEntry)
      : setRandomEntry(null);
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
            variant="secondary"
            onClick={onResetFilterButtonClick}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Random Entry */}
      <div className="mb-3">
        <h5 className="text-muted">Random</h5>
        <OverlayTrigger
          placement="right"
          overlay={
            <Tooltip id="random-tooltip">
              Randomizer factors in current category, filters, and the search
              bar
            </Tooltip>
          }
        >
          <Button
            type="button"
            variant="info"
            onClick={onRandomButtonClick}
            className="d-flex"
          >
            <span className="material-icons">shuffle</span>
          </Button>
        </OverlayTrigger>
        {randomEntry !== null && (
          <RandomEntryRow
            key={0}
            entry={randomEntry}
            setEditedEntry={setEditedEntry}
            showModal={showModal}
          />
        )}
      </div>
    </Container>
  );
}

export default Submenu;
