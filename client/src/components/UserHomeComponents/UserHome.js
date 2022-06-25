import {useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';
import CategoryListGroup from './CategoryListGroup';
import EntryModal from './EntryModal';
import Submenu from './Submenu';
import EntryGrid from './EntryGrid';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

function UserHome() {
  // Submenu
  const [submenuShow, setSubmenuShow] = useState(false);

  // Modals
  const [entryModalShow, setEntryModalShow] = useState(false);

  // Sort and filters
  const [sort, setSort] = useState('priority');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  // Alerts
  const [showAlert, setShowAlert] = useState(false);

  // Organizing props
  const sortData = {sort, setSort};
  const filterData = {status, priority, setStatus, setPriority};
  const modalData = {
    status,
    priority,
  };

  useEffect(() => {
    if (showAlert === true) {
      setTimeout(() => setShowAlert(false), 3000);
    }
  }, [showAlert]);

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
          <EntryGrid />
          <Outlet />
        </Container>
      </Container>
    </>
  );
}

export default UserHome;
