const TYPE_NAME = {
  progress: '进度',
  wiki: '维基',
};
const TIMELINE_TYPES = Object.keys(TYPE_NAME);

function getDate(offset) {
  return new Date(Date.now() + 2.88e7 + 8.64e7 * offset).toISOString().slice(0, 10);
}

function transTimelines(timelines) {
  return Object.assign({}, ...timelines.map(({ date, ids }) => ({ [date]: ids.length })));
}

class StatusError extends Error {
  constructor(status, ...args) {
    super(...args);
    this.status = status;
  }
}

module.exports = {
  TYPE_NAME,
  TIMELINE_TYPES,
  getDate,
  transTimelines,
  StatusError,
};
