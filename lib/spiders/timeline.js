const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { getDate, StatusError, checkUsername } = require('../utils.js');

function dateTrans(date) {
  if (date === '今天') {
    return getDate(0);
  }
  if (date === '昨天') {
    return getDate(-1);
  }
  return date.replace(/\b(\d)\b/g, '0$1');
}

function getTimelines(username, type, page) {
  const api = `https://bgm.tv/user/${username}/timeline?type=${type}&ajax=1&page=${page}`;
  return fetch(api)
    .then(res => res.text())
    .then(cheerio.load)
    .then(($) => {
      if ($('#main').length) {
        throw new StatusError(404, `User ${username} not fonud`);
      }
      return $('.Header').map((i, header) => {
        const date = dateTrans($(header).text());
        const ids = $(header)
          .next('ul')
          .find('.tml_item')
          .map((j, li) => Number($(li).attr('id').slice(4)))
          .get();
        return { date, ids };
      }).get();
    });
}

function getTimelinesUntil(username, type, page, until) {
  return getTimelines(username, type, page).then(timelines => (
    !timelines.length || timelines.find(tl => new Date(tl.date) <= new Date(until))
      ? timelines
      : getTimelinesUntil(username, type, page + 1, until)
        .then(results => results.concat(timelines))
  ));
}

module.exports = function main(username, type, until) {
  return checkUsername(username)
    .then(() => getTimelinesUntil(username, type, 1, until))
    .then(timelines => ({ until: getDate(-1), timelines }));
};
