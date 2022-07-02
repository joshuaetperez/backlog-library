const categoryArray = ['', 'movies', 'tv', 'anime', 'manga', 'games', 'books'];
const statusArray = ['Ongoing', 'Planning'];
const priorityArray = ['High', 'Medium', 'Low'];
const typeArray = ['Movie', 'TV', 'Anime', 'Manga', 'Game', 'Book'];

// Every entries-related arrow function below MUTATE the given entries array and RETURN it
// Use a copied array for the argument

const sortEntriesByTitle = (entries) => {
  entries.sort((a, b) => {
    if (a.title.toLocaleLowerCase() < b.title.toLocaleLowerCase()) return -1;
    else if (a.title > b.title) return 1;
    return 0;
  });
};

const sortEntriesByPriority = (entries) => {
  entries.sort((a, b) => a.priority_id - b.priority_id);
};

const sortEntriesByType = (entries) => {
  entries.sort((a, b) => a.category_id - b.category_id);
};

const sortEntries = (entries, sortID) => {
  if (sortID === 1) {
    sortEntriesByTitle(entries);
  } else if (sortID === 2) {
    sortEntriesByPriority(entries);
  } else if (sortID === 3) {
    sortEntriesByType(entries);
  }
  return entries;
};

const removeEntry = (entries, entryID) => {
  for (let i = 0; i <= entries.length - 1; i++) {
    if (entries[i].entry_id === entryID) {
      entries.splice(i, 1);
      break;
    }
  }
  return entries;
};

module.exports = {
  categoryArray,
  statusArray,
  priorityArray,
  typeArray,
  sortEntries,
  removeEntry,
};
