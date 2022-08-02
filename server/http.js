const CLIENT_URL =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : process.env.CLIENT_URL;

module.exports = CLIENT_URL;
