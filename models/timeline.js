const spider = require('../lib/spiders/timeline.js');
const queue = require('../models/queue.js');
const db = require('./db.js');

async function update(username, type, entity) {
  return spider(username, type, entity.lastUpdated)
    .then(result => ([
      {
        name: 'lastUpdated',
        value: new Date(),
      },
      {
        name: 'data',
        value: Object.assign({}, entity.data, result),
        excludeFromIndexes: true,
      },
    ]))
    .then(data => db.upsert(username, 'Timeline', type, data));
}

function tryUpdate(username, type, entity = { lastUpdated: 0, data: {} }) {
  if (Date.now() - entity.lastUpdated > 8.64e7) {
    queue.push({
      id: `${username}/timelines/${type}`,
      fn: update,
      args: [username, type, entity],
    });
  }
}

async function get(username, type) {
  const [entity] = await db.get(username, 'Timeline', type);
  tryUpdate(username, type, entity);
  if (!entity) {
    return null;
  }
  return entity.data;
}

module.exports = {
  update,
  tryUpdate,
  get,
};
