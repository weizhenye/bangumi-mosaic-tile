const Datastore = require('@google-cloud/datastore');
const { KIND_MAP } = require('../lib/utils.js');
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
  const keys = [].concat(
    ...Object.keys(KIND_MAP)
      .map(kind => (
        Object.keys(KIND_MAP[kind].type)
          .map(type => genKey(username, kind, type))
      )),
  );
  return datastore.get(keys);
}

module.exports = {
  datastore,
  KEY: datastore.KEY,
  get,
  upsert,
  getAll,
};
