const spider = require('../lib/spider.js');
const { transTimelines } = require('../lib/utils.js');
const queue = require('../models/queue.js');
const db = require('./db.js');

function mergeTimelines(sources, targets) {
  targets.forEach((target) => {
    const source = sources.find(s => s.date === target.date);
    if (source) {
      source.ids = [...new Set(source.ids.concat(target.ids))];
    } else {
      sources.push(target);
    }
  });
  return sources;
}

async function update(username, type, entity) {
  return spider(username, type, entity.until)
    .then(({ until, timelines }) => ({
      type,
      lastUpdated: new Date(),
      until: until || entity.until,
      timelines: mergeTimelines(entity.timelines, timelines),
    }))
    .then(data => db.upsert(username, type, data));
}

function tryUpdate(username, type, entity = { lastUpdated: 0, until: '', timelines: [] }) {
  if (Date.now() - entity.lastUpdated > 8.64e7) {
    queue.push({
      id: `${username}-${type}`,
      fn: update,
      args: [username, type, entity],
    });
  }
}

async function get(username, type) {
  const [entity] = await db.get(username, type);
  tryUpdate(username, type, entity);
  if (!entity) {
    return null;
  }
  return transTimelines(entity.timelines);
}

module.exports = {
  update,
  tryUpdate,
  get,
};
