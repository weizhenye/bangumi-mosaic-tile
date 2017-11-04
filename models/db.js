const Datastore = require('@google-cloud/datastore');
const { TIMELINE_TYPES } = require('../lib/utils.js');
const config = require('../config.js');

const datastore = Datastore(config.datastore);

function genKey(username, kind, type) {
  return datastore.key(['User', username, kind, type]);
}

function get(username, kind, type) {
  const key = genKey(username, kind, type);
  return datastore.get(key);
}

function upsert(username, kind, type, data) {
  const key = genKey(username, kind, type);
  return datastore.upsert({ key, data });
}

function getAll(username) {
  const keys = TIMELINE_TYPES.map(type => genKey(username, 'Timeline', type));
  return datastore.get(keys);
}

module.exports = {
  datastore,
  KEY: datastore.KEY,
  get,
  upsert,
  getAll,
};
