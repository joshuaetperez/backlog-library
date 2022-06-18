import {useState} from 'react';
import EntryModal from './EntryModal';
import Submenu from './Submenu';

function UserHome() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Title');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [notes, setNotes] = useState('');

  const categoryData = {category, setCategory};
  const sortData = {sort, setSort};
  const filterData = {status, priority, setStatus, setPriority};
  const modalData = {title, notes, setTitle, setNotes};

  return (
    <>
      <EntryModal />
      <div className="container-fluid bg-light py-3 d-flex flex-column flex-grow-1">
        <div className="container my-3 p-0 d-flex flex-column">
          <Submenu
            categoryData={categoryData}
            sortData={sortData}
            filterData={filterData}
            modalData={modalData}
          />
        </div>
      </div>
    </>
  );
}

export default UserHome;
