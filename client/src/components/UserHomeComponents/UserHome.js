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
import DeleteEntryModal from './DeleteEntryModal';

function UserHome() {
  // Loading state (need to fetch user entries first)
  const [loading, setLoading] = useState(true);

  // User entries
  const [entries, setEntries] = useState([]);
  const [editedEntry, setEditedEntry] = useState(null);
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

  // Modal
  const [modal, setModal] = useState(null);

  // Sort and filters
  const [timeToSort, setTimeToSort] = useState(true);
  const [sortID, setSortID] = useState(2); // Default option 2 sorts by entries priority
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
  const [alert, setAlert] = useState(null);
  const alertWord = () => {
    if (alert === 'Add') return 'added';
    else if (alert === 'Edit') return 'edited';
    else if (alert === 'Delete') return 'deleted';
    return null;
  };
  useEffect(() => {
    const alertStates = ['Add', 'Edit', 'Delete'];
    if (alertStates.includes(alert)) {
      setTimeout(() => setAlert(null), 3000);
    }
  }, [alert]);

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
  const modalData = {
    entries,
    editedEntry,
    setEntries,
    setTimeToSort,
  };

  return (
    <>
      <AddEntryModal
        show={modal === 'Add'}
        onHide={() => setModal(null)}
        showAlert={() => setAlert('Add')}
        entryData={entryData}
      />
      <EditEntryModal
        show={modal === 'Edit'}
        onHide={() => setModal(null)}
        showDeleteModal={() => setModal('Delete')}
        showAlert={() => setAlert('Edit')}
        modalData={modalData}
      />
      <DeleteEntryModal
        show={modal === 'Delete'}
        onHide={() => setModal(null)}
        onCancel={() => setModal('Edit')}
        showAlert={() => setAlert('Delete')}
        modalData={modalData}
      />
      <Container
        fluid
        className="bg-light position-relative py-3 d-flex flex-column flex-grow-1"
      >
        {alert !== null && (
          <Container className="alert-container position-fixed start-50 translate-middle mt-sm-3">
            <Alert variant="success" onClose={() => setAlert(null)} dismissible>
              <p className="m-0 text-center">
                Entry {alertWord()} successfully!
              </p>
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
                <Button variant="success" onClick={() => setModal('Add')}>
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
            setEditedEntry={setEditedEntry}
            showModal={() => setModal('Edit')}
          />
          <Outlet />
        </Container>
      </Container>
    </>
  );
}

export default UserHome;
