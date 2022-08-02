const CLIENT_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL
    : 'http://localhost:3000';

const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.SERVER_URL
    : 'http://localhost:5000/api';

module.exports = {CLIENT_URL, SERVER_URL};
