const Datastore = require('@google-cloud/datastore');
const { TIMELINE_TYPES } = require('../lib/utils.js');
const config = require('../config.js');

const datastore = Datastore(config.datastore);

function genKey(username, type) {
  return datastore.key(['User', username, 'Timeline', type]);
}

function get(username, type) {
  const key = genKey(username, type);
  return datastore.get(key);
}

function upsert(username, type, data) {
  const key = genKey(username, type);
  return datastore.upsert({ key, data });
}

function getAll(username) {
  const keys = TIMELINE_TYPES.map(type => genKey(username, type));
  return datastore.get(keys);
}

module.exports = {
  datastore,
  get,
  upsert,
  getAll,
};
