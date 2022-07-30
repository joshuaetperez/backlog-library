const categoryArray = ['', 'movies', 'tv', 'anime', 'manga', 'games', 'books'];
const statusArray = ['Ongoing', 'Planning'];
const priorityArray = ['High', 'Medium', 'Low'];
const typeArray = ['Movie', 'TV', 'Anime', 'Manga', 'Game', 'Book'];

/* ---------------------------------------------------------------- */
/* Every entry-related arrow function below MUTATE the given entries array and RETURN it. Use a copied array for the argument. */
/* ---------------------------------------------------------------- */

// Sorts by title, then type
const sortEntriesByTitle = (entries) => {
  entries.sort(
    (a, b) => a.title.localeCompare(b.title) || a.category_id - b.category_id
  );
};

// Sorts by priority, then type, then title
const sortEntriesByPriority = (entries) => {
  entries.sort(
    (a, b) =>
      a.priority_id - b.priority_id ||
      a.category_id - b.category_id ||
      a.title.localeCompare(b.title)
  );
};

// Sorts by type, then priority, then title
const sortEntriesByType = (entries) => {
  entries.sort(
    (a, b) =>
      a.category_id - b.category_id ||
      a.priority_id - b.priority_id ||
      a.title.localeCompare(b.title)
  );
};

// Sorts entries based on given sorting method
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

// Removes entry with corresponding entry_id
const removeEntry = (entries, entryID) => {
  for (let i = 0; i <= entries.length - 1; i++) {
    if (entries[i].entry_id === entryID) {
      entries.splice(i, 1);
      break;
    }
  }
  return entries;
};

/* ---------------------------------------------------------------- */
/* Every entry-related arrow function below does NOT mutate the given entries array. */
/* ---------------------------------------------------------------- */

// Returns a random entry taking filters into account (if any)
// filterObj: {categoryID, statusID, priorityID}
const getRandomEntry = (prevRandomEntry, entries, filterObj) => {
  const {categoryID, statusID, priorityID, searchText} = filterObj;
  let filteredEntries = entries.filter(
    (entry) =>
      (categoryID === 0 || entry.category_id === categoryID) &&
      (statusID === 0 || entry.status_id === statusID) &&
      (priorityID === 0 || entry.priority_id === priorityID) &&
      entry.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // If possible, return a random entry that is different from the previous entry
  if (prevRandomEntry !== null && filteredEntries.length > 1) {
    filteredEntries = removeEntry(filteredEntries, prevRandomEntry.entry_id);
  }
  const randomEntry =
    filteredEntries[Math.floor(Math.random() * filteredEntries.length)];
  return randomEntry;
};

module.exports = {
  categoryArray,
  statusArray,
  priorityArray,
  typeArray,
  sortEntries,
  removeEntry,
  getRandomEntry,
};
