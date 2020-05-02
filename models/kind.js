const queue = require('./queue.js');
const db = require('./db.js');
const sTimeline = require('../lib/spiders/timeline.js');
const sWiki = require('../lib/spiders/wiki.js');

const spider = { Timeline: sTimeline, Wiki: sWiki };

async function update(username, kind, type, entity) {
  return spider[kind](username, type, entity.lastUpdated)
    .then((result) => ([
      {
        name: 'lastUpdated',
        value: new Date(),
      },
      {
        name: 'data',
        value: { ...entity.data, ...result },
        excludeFromIndexes: true,
      },
    ]))
    .then((data) => db.upsert(username, kind, type, data));
}

function tryUpdate(username, kind, type, entity = { lastUpdated: 0, data: {} }) {
  if (Date.now() - entity.lastUpdated > 8.64e7) {
    queue.push({
      id: `${username}/${kind.toLowerCase()}s/${type}`,
      fn: update,
      args: [username, kind, type, entity],
    });
  }
}

async function get(username, kind, type) {
  const [entity] = await db.get(username, kind, type);
  return entity;
}

module.exports = {
  get,
  tryUpdate,
};
