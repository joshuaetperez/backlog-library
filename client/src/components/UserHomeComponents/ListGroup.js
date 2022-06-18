function ListGroup(props) {
  const {category, setCategory} = props.categoryData;

  return (
    <div className="list-group p-0">
      <button
        type="button"
        className={`list-group-item list-group-item-action ${
          category === 'All' ? 'active' : ''
        }`}
        onClick={(e) => setCategory('All')}
        {...(category === 'All' ? {'aria-current': 'true'} : {})}
      >
        All
      </button>
      <button
        type="button"
        className={`list-group-item list-group-item-action ${
          category === 'Movies' ? 'active' : ''
        }`}
        onClick={(e) => setCategory('Movies')}
        {...(category === 'Movies' ? {'aria-current': 'true'} : {})}
      >
        Movies
      </button>
      <button
        type="button"
        className={`list-group-item list-group-item-action ${
          category === 'TV' ? 'active' : ''
        }`}
        onClick={(e) => setCategory('TV')}
        {...(category === 'TV' ? {'aria-current': 'true'} : {})}
      >
        TV
      </button>
      <button
        type="button"
        className={`list-group-item list-group-item-action ${
          category === 'Anime' ? 'active' : ''
        }`}
        onClick={(e) => setCategory('Anime')}
        {...(category === 'Anime' ? {'aria-current': 'true'} : {})}
      >
        Anime
      </button>
      <button
        type="button"
        className={`list-group-item list-group-item-action ${
          category === 'Manga' ? 'active' : ''
        }`}
        onClick={(e) => setCategory('Manga')}
        {...(category === 'Manga' ? {'aria-current': 'true'} : {})}
      >
        Manga
      </button>
      <button
        type="button"
        className={`list-group-item list-group-item-action ${
          category === 'Games' ? 'active' : ''
        }`}
        onClick={(e) => setCategory('Games')}
        {...(category === 'Games' ? {'aria-current': 'true'} : {})}
      >
        Games
      </button>
      <button
        type="button"
        className={`list-group-item list-group-item-action ${
          category === 'Books' ? 'active' : ''
        }`}
        onClick={(e) => setCategory('Books')}
        {...(category === 'Books' ? {'aria-current': 'true'} : {})}
      >
        Books
      </button>
    </div>
  );
}

export default ListGroup;
