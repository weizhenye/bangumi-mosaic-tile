const fetch = require('node-fetch');

const KIND_MAP = {
  Timeline: {
    name: '时间胶囊',
    type: {
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
    },
  },
  Wiki: {
    name: '维基',
    type: {
      subject: '条目',
      character: '角色',
      person: '人物',
      ep: '章节',
    },
  },
};

function getDate(offset) {
  return new Date(Date.now() + 2.88e7 + 8.64e7 * offset).toISOString().slice(0, 10);
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
  KIND_MAP,
  getDate,
  StatusError,
  checkUsername,
};
