const app = require('./app.js');

module.exports = {
  // Google Cloud Functions
  server: app.callback(),
};
