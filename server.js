const app = require('./app.js');
const config = require('./config.js');

app.listen(config.server, () => {
  const { host, port } = config.server;
  console.info(`Bangumi Mosaic Tile is running on ${host}:${port}.`);
});
