import {useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';
import CategoryListGroup from './CategoryListGroup';
import AddEntryModal from './AddEntryModal';
import EditEntryModal from './EditEntryModal';
import Submenu from './Submenu';
import Entries from './Entries';
import {sortEntries} from './entry_helpers';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

function UserHome() {
  // Loading state (need to fetch user entries first)
  const [loading, setLoading] = useState(true);

  // User entries
  const [entries, setEntries] = useState([]);
  const [edittedEntry, setEdittedEntry] = useState(null);
  useEffect(() => {
    async function getEntries() {
      try {
        const response = await fetch(`http://localhost:5000/get_entries`, {
          credentials: 'include',
        });
        const entries = await response.json();
        setEntries(entries);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    if (loading && entries.length === 0) {
      getEntries();
    }
  }, [loading, entries.length]);

  // Submenu
  const [submenuShow, setSubmenuShow] = useState(false);

  // Modals
  const [addEntryModalShow, setAddEntryModalShow] = useState(false);
  const [editEntryModalShow, setEditEntryModalShow] = useState(false);

  // Sort and filters
  const [timeToSort, setTimeToSort] = useState(true);
  const [sortID, setSortID] = useState(2);
  const [statusID, setStatusID] = useState(0);
  const [priorityID, setPriorityID] = useState(0);
  useEffect(() => {
    if (timeToSort && entries.length > 0) {
      const sortedEntries = sortEntries([...entries], sortID);
      setEntries(sortedEntries);
      setTimeToSort(false);
    }
  }, [entries, timeToSort, sortID]);

  // Alerts
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [showEditAlert, setShowEditAlert] = useState(false);
  useEffect(() => {
    if (showAddAlert) {
      setTimeout(() => setShowAddAlert(false), 3000);
    } else if (showEditAlert) {
      setTimeout(() => setShowEditAlert(false), 3000);
    }
  }, [showAddAlert, showEditAlert]);

  // Organizing props
  const sortData = {sortID, setTimeToSort, setSortID};
  const filterData = {statusID, priorityID, setStatusID, setPriorityID};
  const entryData = {
    statusID,
    priorityID,
    entries,
    setEntries,
    setTimeToSort,
  };
  const editModalData = {
    entries,
    edittedEntry,
    setEntries,
    setTimeToSort,
  };

  const onAddEntryButtonClick = () => {
    setAddEntryModalShow(true);
  };

  const onEditEntryClick = () => {
    setEditEntryModalShow(true);
  };

  return (
    <>
      <AddEntryModal
        show={addEntryModalShow}
        onHide={() => setAddEntryModalShow(false)}
        onSetShowAlert={setShowAddAlert}
        entryData={entryData}
      />
      <EditEntryModal
        show={editEntryModalShow}
        onHide={() => setEditEntryModalShow(false)}
        onSetShowAlert={setShowEditAlert}
        editModalData={editModalData}
      />
      <Container
        fluid
        className="bg-light position-relative py-3 d-flex flex-column flex-grow-1"
      >
        {showAddAlert && (
          <Container className="alert-container position-fixed start-50 translate-middle mt-sm-3">
            <Alert
              variant="success"
              onClose={() => setShowAddAlert(false)}
              dismissible
            >
              <p className="m-0 text-center">Entry added successfully!</p>
            </Alert>
          </Container>
        )}
        {showEditAlert && (
          <Container className="alert-container position-fixed start-50 translate-middle mt-sm-3">
            <Alert
              variant="success"
              onClose={() => setShowEditAlert(false)}
              dismissible
            >
              <p className="m-0 text-center">Entry edited successfully!</p>
            </Alert>
          </Container>
        )}
        <Container className="container my-3 p-0 d-flex flex-column">
          {/* Category Listgroup */}
          <Container className="p-0">
            <div className="mb-3">
              <h5 className="text-muted">Category</h5>
              <CategoryListGroup />
              <div className="d-grid gap-2 col-10 my-3 mx-auto">
                {/* Add Entry Button */}
                <Button variant="success" onClick={onAddEntryButtonClick}>
                  Add Entry
                </Button>
              </div>
            </div>
          </Container>
          <Button
            type="button"
            variant="info"
            className="d-flex align-self-end"
            onClick={() =>
              submenuShow ? setSubmenuShow(false) : setSubmenuShow(true)
            }
          >
            <span className="material-icons">menu</span>
          </Button>
          {submenuShow && (
            <Submenu sortData={sortData} filterData={filterData} />
          )}
          <Entries
            entryData={entryData}
            setEdittedEntry={setEdittedEntry}
            onEditEntryClick={onEditEntryClick}
          />
          <Outlet />
        </Container>
      </Container>
    </>
  );
}

export default UserHome;
