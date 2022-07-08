import {useLocation} from 'react-router-dom';
import {
  categoryArray,
  priorityArray,
  statusArray,
  typeArray,
} from './entry_helpers';
import Container from 'react-bootstrap/Container';
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
      <Col xs={6} md={8}>
        <span className="entry-title" onClick={() => onTitleClick(entry)}>
          {entry.title}
        </span>
      </Col>
      <Col xs={3} md={2}>
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
          <Col xs={6} md={8}>
            Title
          </Col>
          <Col xs={3} md={2}>
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
  const categoryID = categoryArray.indexOf(useLocation().pathname.substring(1));

  const showEntries = () => {
    return entries.map((entry) => {
      // Conditions for rendering entries
      const statusCondition = entry.status_id === gridID;
      const priorityCondition =
        priorityID === 0 || entry.priority_id === priorityID;
      const categoryCondition =
        categoryID === 0 || entry.category_id === categoryID;

      return (
        statusCondition &&
        priorityCondition &&
        categoryCondition && (
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
      <Container className="px-0 py-3">
        <h4 className="text-secondary">{statusArray[gridID - 1]}</h4>
        <Container className="bg-white fs-5 border-bottom">
          <Row className="px-3 py-2 fw-bold">
            <Col xs={6} md={8}>
              Title
            </Col>
            <Col xs={3} md={2}>
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

function Entries(props) {
  return (
    <Container className="p-0">
      <EntryGrid
        entryData={{...props.entryData, gridID: 1}}
        setEditedEntry={props.setEditedEntry}
        showModal={props.showModal}
      />
      <EntryGrid
        entryData={{...props.entryData, gridID: 2}}
        setEditedEntry={props.setEditedEntry}
        showModal={props.showModal}
      />
    </Container>
  );
}

export {RandomEntryRow};
export default Entries;
