const genSVG = require('../lib/svg.js');
const { TIMELINE_TYPES, TIMELINE_NAME, transTimelines } = require('../lib/utils.js');
const db = require('./db.js');
const { tryUpdate } = require('./timeline.js');
const { ga } = require('../config.js');

async function get(username) {
  const [entities] = await db.getAll(username);
  const timelines = TIMELINE_TYPES.map((type) => {
    const entity = entities.find(e => e[db.KEY].name === type);
    tryUpdate(username, type, entity);
    return {
      type,
      name: TIMELINE_NAME[type],
      svg: entity ? genSVG(transTimelines(entity.timelines)) : '',
    };
  });
  if (!entities.length) {
    return null;
  }
  return {
    ga,
    username,
    timelines,
  };
}

module.exports = {
  get,
};
