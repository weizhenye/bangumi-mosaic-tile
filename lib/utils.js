const fetch = require('node-fetch');

const TIMELINE_NAME = {
  say: '吐槽',
  subject: '收藏',
  progress: '进度',
  blog: '日志',
  mono: '人物',
  relation: '好友',
  group: '小组',
  wiki: '维基',
  index: '目录',
  doujin: '天窗',
};
const TIMELINE_TYPES = Object.keys(TIMELINE_NAME);

const WIKI_NAME = {
  subject: '条目',
  character: '角色',
  person: '人物',
  ep: '章节',
};
const WIKI_TYPES = Object.keys(WIKI_NAME);

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

function checkUsername(username) {
  const api = `https://api.bgm.tv/user/${username}`;
  return fetch(api)
    .then(res => res.json())
    .then(({ code }) => {
      if (code === 404) {
        throw new StatusError(404, `User ${username} not fonud.`);
      }
    });
}

module.exports = {
  TIMELINE_NAME,
  TIMELINE_TYPES,
  WIKI_NAME,
  WIKI_TYPES,
  getDate,
  transTimelines,
  StatusError,
  checkUsername,
};
