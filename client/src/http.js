const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://backlog-library.herokuapp.com'
    : process.env.REACT_APP_BASE_URL;

export default BASE_URL;
