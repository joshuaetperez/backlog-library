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

function EntryGrid(props) {
  const {statusID, gridID, priorityID, entries} = props.entryData;
  const categoryID = categoryArray.indexOf(useLocation().pathname.substring(1));

  const onSpanClick = (entry) => {
    props.setEdittedEntry(entry);
    props.onEditEntryClick();
  };

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
          <Row
            className="entry-div px-3 py-2 border border-bottom-0"
            key={entry.entry_id}
          >
            <Col xs={6} md={8}>
              <span className="entry-title" onClick={() => onSpanClick(entry)}>
                {entry.title}
              </span>
            </Col>
            <Col xs={3} md={2}>
              {priorityArray[entry.priority_id - 1]}
            </Col>
            <Col>{typeArray[entry.category_id - 1]}</Col>
          </Row>
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
        setEdittedEntry={props.setEdittedEntry}
        onEditEntryClick={props.onEditEntryClick}
      />
      <EntryGrid
        entryData={{...props.entryData, gridID: 2}}
        setEdittedEntry={props.setEdittedEntry}
        onEditEntryClick={props.onEditEntryClick}
      />
    </Container>
  );
}

export default Entries;
