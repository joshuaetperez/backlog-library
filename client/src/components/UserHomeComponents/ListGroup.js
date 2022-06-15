import {useState} from 'react';

function ListGroup() {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <div className="list-group p-0">
      <button
        type="button"
        className={`list-group-item list-group-item-action ${
          activeTab === 'All' ? 'active' : ''
        }`}
        onClick={(e) => setActiveTab('All')}
        {...(activeTab === 'All' ? {'aria-current': 'true'} : {})}
      >
        All
      </button>
      <button
        type="button"
        className={`list-group-item list-group-item-action ${
          activeTab === 'Movies' ? 'active' : ''
        }`}
        onClick={(e) => setActiveTab('Movies')}
        {...(activeTab === 'Movies' ? {'aria-current': 'true'} : {})}
      >
        Movies
      </button>
      <button
        type="button"
        className={`list-group-item list-group-item-action ${
          activeTab === 'TV' ? 'active' : ''
        }`}
        onClick={(e) => setActiveTab('TV')}
        {...(activeTab === 'TV' ? {'aria-current': 'true'} : {})}
      >
        TV
      </button>
      <button
        type="button"
        className={`list-group-item list-group-item-action ${
          activeTab === 'Anime' ? 'active' : ''
        }`}
        onClick={(e) => setActiveTab('Anime')}
        {...(activeTab === 'Anime' ? {'aria-current': 'true'} : {})}
      >
        Anime
      </button>
      <button
        type="button"
        className={`list-group-item list-group-item-action ${
          activeTab === 'Manga' ? 'active' : ''
        }`}
        onClick={(e) => setActiveTab('Manga')}
        {...(activeTab === 'Manga' ? {'aria-current': 'true'} : {})}
      >
        Manga
      </button>
      <button
        type="button"
        className={`list-group-item list-group-item-action ${
          activeTab === 'Games' ? 'active' : ''
        }`}
        onClick={(e) => setActiveTab('Games')}
        {...(activeTab === 'Games' ? {'aria-current': 'true'} : {})}
      >
        Games
      </button>
      <button
        type="button"
        className={`list-group-item list-group-item-action ${
          activeTab === 'Books' ? 'active' : ''
        }`}
        onClick={(e) => setActiveTab('Books')}
        {...(activeTab === 'Books' ? {'aria-current': 'true'} : {})}
      >
        Books
      </button>
    </div>
  );
}

export default ListGroup;
