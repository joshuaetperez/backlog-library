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

  // Modal form info
  const [entryTitle, setEntryTitle] = useState('');
  const [entryCategory, setEntryCategory] = useState('All');
  const [entryStatus, setEntryStatus] = useState('');
  const [entryPriority, setEntryPriority] = useState('');
  const [entryNotes, setEntryNotes] = useState('');

  // Organizing props
  const categoryData = {category, setCategory};
  const sortData = {sort, setSort};
  const filterData = {status, priority, setStatus, setPriority};
  const modalData = {title, notes, setTitle, setNotes};
  const entryData = {
    entryTitle,
    entryCategory,
    entryStatus,
    entryPriority,
    entryNotes,
    setEntryTitle,
    setEntryCategory,
    setEntryStatus,
    setEntryPriority,
    setEntryNotes,
  };

  const onAddEntryButtonClick = () => {
    setEntryTitle(title);
    setEntryCategory(category);
    setEntryStatus(status);
    setEntryPriority(priority);
    setEntryNotes(notes);
  };

  return (
    <>
      <EntryModal entryData={entryData} />
      <div className="container-fluid bg-light py-3 d-flex flex-column flex-grow-1">
        <div className="container my-3 p-0 d-flex flex-column">
          <Submenu
            categoryData={categoryData}
            sortData={sortData}
            filterData={filterData}
            modalData={modalData}
            onAddEntryButtonClick={onAddEntryButtonClick}
          />
        </div>
      </div>
    </>
  );
}

export default UserHome;
