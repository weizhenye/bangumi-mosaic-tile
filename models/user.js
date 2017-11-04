const genSVG = require('../lib/svg.js');
const { TIMELINE_TYPES, TYPE_NAME, transTimelines } = require('../lib/utils.js');
const db = require('./db.js');
const { tryUpdate } = require('./timeline.js');

async function get(username) {
  const [entities] = await db.getAll(username);
  const timelines = TIMELINE_TYPES.map((type) => {
    const entity = entities.find(e => e.type === type);
    tryUpdate(username, type, entity);
    return {
      type,
      name: TYPE_NAME[type],
      svg: entity ? genSVG(transTimelines(entity.timelines)) : '',
    };
  });
  if (!entities.length) {
    return null;
  }
  return {
    username,
    timelines,
  };
}

module.exports = {
  get,
};
