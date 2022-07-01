import {useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';
import CategoryListGroup from './CategoryListGroup';
import EntryModal from './EntryModal';
import Submenu from './Submenu';
import Entries from './Entries';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import {sortEntries} from './entry_helpers';

function UserHome() {
  // Loading state (need to fetch user entries first)
  const [loading, setLoading] = useState(true);

  // User entries
  const [entries, setEntries] = useState([]);
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
  const [entryModalShow, setEntryModalShow] = useState(false);

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
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    if (showAlert === true) {
      setTimeout(() => setShowAlert(false), 3000);
    }
  }, [showAlert]);

  // Organizing props
  const sortData = {sortID, setTimeToSort, setSortID};
  const filterData = {statusID, priorityID, setStatusID, setPriorityID};
  const modalData = {
    statusID,
    priorityID,
  };
  const entryData = {
    statusID,
    priorityID,
    entries,
    setEntries,
  };

  const onAddEntryButtonClick = () => {
    setEntryModalShow(true);
  };

  return (
    <>
      <EntryModal
        show={entryModalShow}
        onHide={() => setEntryModalShow(false)}
        onSetShowAlert={setShowAlert}
        modalData={modalData}
      />
      <Container
        fluid
        className="bg-light position-relative py-3 d-flex flex-column flex-grow-1"
      >
        {showAlert && (
          <Container className="alert-container position-fixed start-50 translate-middle mt-sm-3">
            <Alert
              variant="success"
              onClose={() => setShowAlert(false)}
              dismissible
            >
              <p className="m-0 text-center">Entry added successfully!</p>
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
          <Entries entryData={entryData} />
          <Outlet />
        </Container>
      </Container>
    </>
  );
}

export default UserHome;
