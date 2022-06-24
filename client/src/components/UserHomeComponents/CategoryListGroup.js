import {NavLink} from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';

function CategoryListGroup() {
  return (
    <ListGroup defaultActiveKey="/">
      <ListGroup.Item as={NavLink} to="/" action>
        All
      </ListGroup.Item>
      <ListGroup.Item as={NavLink} to="movies" action>
        Movies
      </ListGroup.Item>
      <ListGroup.Item as={NavLink} to="tv" action>
        TV
      </ListGroup.Item>
      <ListGroup.Item as={NavLink} to="anime" action>
        Anime
      </ListGroup.Item>
      <ListGroup.Item as={NavLink} to="manga" action>
        Manga
      </ListGroup.Item>
      <ListGroup.Item as={NavLink} to="games" action>
        Games
      </ListGroup.Item>
      <ListGroup.Item as={NavLink} to="books" action>
        Books
      </ListGroup.Item>
    </ListGroup>
  );
}

export default CategoryListGroup;
