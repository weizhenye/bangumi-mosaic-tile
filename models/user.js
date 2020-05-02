const genSVG = require('../lib/svg.js');
const { KIND_MAP } = require('../lib/utils.js');
const db = require('./db.js');
const { tryUpdate } = require('./kind.js');
const { ga } = require('../config.js');

async function get(username) {
  const [entities] = await db.getAll(username);
  const tabs = Object.keys(KIND_MAP).map((kind) => {
    const kindObj = KIND_MAP[kind];
    return {
      name: kindObj.name,
      checked: kind === 'Timeline',
      types: Object.keys(kindObj.type).map((type) => {
        const entity = entities.find((e) => e[db.KEY].kind === kind && e[db.KEY].name === type);
        tryUpdate(username, kind, type, entity);
        return {
          type,
          kind: `${kind.toLowerCase()}s`,
          name: kindObj.type[type],
          lastUpdated: entity ? entity.lastUpdated.toISOString() : '',
          svg: entity ? genSVG(entity.data) : '',
        };
      }),
    };
  });
  if (!entities.length) {
    return null;
  }
  return {
    ga,
    username,
    tabs,
  };
}

module.exports = {
  get,
};
