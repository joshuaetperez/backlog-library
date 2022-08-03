import {useLocation} from 'react-router-dom';
import {
  categoryArray,
  getEntryAmount,
  priorityArray,
  statusArray,
  typeArray,
} from './entry_helpers';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function EntryRow(props) {
  const entry = props.entry;

  const onTitleClick = (clickedEntry) => {
    props.setEditedEntry(clickedEntry);
    props.showModal();
  };

  return (
    <Row className="entry-div px-3 py-2 border border-bottom-0">
      <Col xs={12} md={8} className="text-truncate title-bold">
        <span className="entry-title" onClick={() => onTitleClick(entry)}>
          {entry.title}
        </span>
      </Col>
      <Col xs={6} md={2}>
        {priorityArray[entry.priority_id - 1]}
      </Col>
      <Col>{typeArray[entry.category_id - 1]}</Col>
    </Row>
  );
}

function RandomEntryRow(props) {
  const entry = props.entry;

  return (
    <Container className="px-0 py-3">
      <Container className="bg-white fs-5 border-bottom">
        <Row className="px-3 py-2 fw-bold">
          <Col xs={12} md={8}>
            Title
          </Col>
          <Col xs={6} md={2}>
            Priority
          </Col>
          <Col>Type</Col>
        </Row>
        <EntryRow
          key={0}
          entry={entry}
          setEditedEntry={props.setEditedEntry}
          showModal={props.showModal}
        />
      </Container>
    </Container>
  );
}

function EntryGrid(props) {
  const {statusID, gridID, priorityID, entries} = props.entryData;
  const searchText = props.searchText;
  const categoryID = categoryArray.indexOf(useLocation().pathname.substring(1));
  const filterObj = {categoryID, gridID, priorityID, searchText};

  const showEntries = () => {
    return entries.map((entry) => {
      // Conditions for rendering entries
      const statusCondition = entry.status_id === gridID;
      const priorityCondition =
        priorityID === 0 || entry.priority_id === priorityID;
      const categoryCondition =
        categoryID === 0 || entry.category_id === categoryID;
      const searchCondition = entry.title
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const allConditions =
        statusCondition &&
        priorityCondition &&
        categoryCondition &&
        searchCondition;

      return (
        allConditions && (
          <EntryRow
            key={entry.entry_id}
            entry={entry}
            setEditedEntry={props.setEditedEntry}
            showModal={props.showModal}
          />
        )
      );
    });
  };

  return (
    (statusID === 0 || statusID === gridID) && (
      <Container className="px-0 pb-5">
        <h4 className="text-secondary mb-3">
          {statusArray[gridID - 1]} ({getEntryAmount(entries, filterObj)})
        </h4>
        <Container className="bg-white fs-5 border-bottom">
          <Row className="px-3 py-2 fw-bold">
            <Col xs={12} md={8}>
              Title
            </Col>
            <Col xs={6} md={2}>
              Priority
            </Col>
            <Col>Type</Col>
          </Row>
          {showEntries()}
        </Container>
      </Container>
    )
  );
}

function SearchBar(props) {
  return (
    <Form>
      <Form.Label htmlFor="search-bar" visuallyHidden>
        Search bar
      </Form.Label>
      <InputGroup className="mb-4">
        <InputGroup.Text className="material-icons">search</InputGroup.Text>
        <Form.Control
          id="search-bar"
          placeholder="Search by title..."
          value={props.searchData.searchText}
          onChange={(e) => {
            props.searchData.setSearchText(e.target.value);
          }}
        />
      </InputGroup>
    </Form>
  );
}

function Entries(props) {
  const {searchText, setSearchText} = props.searchData;
  return (
    <Container className="p-0 mt-5">
      <SearchBar searchData={{searchText, setSearchText}} />
      <EntryGrid
        entryData={{...props.entryData, gridID: 1}}
        setEditedEntry={props.setEditedEntry}
        showModal={props.showModal}
        searchText={searchText}
      />
      <EntryGrid
        entryData={{...props.entryData, gridID: 2}}
        setEditedEntry={props.setEditedEntry}
        showModal={props.showModal}
        searchText={searchText}
      />
    </Container>
  );
}

export {RandomEntryRow};
export default Entries;
