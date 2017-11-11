const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { checkUsername } = require('../utils.js');

function getWikis(username, type, page) {
  const api = `https://bgm.tv/user/${username}/wiki${type === 'subject' ? '' : `/${type}`}?page=${page}`;
  return fetch(api)
    .then(res => res.text())
    .then(cheerio.load)
    .then($ => (
      $('.line_list li cite small')
        .map((i, el) => $(el).text().split(' ')[0].replace(/\b(\d)\b/g, '0$1'))
        .get()
    ));
}

function getWikisUntil(username, type, page, lastUpdated) {
  return getWikis(username, type, page).then(wikis => (
    !wikis.length || wikis.find(date => new Date(date) - 2.88e7 <= lastUpdated)
      ? wikis.filter(date => new Date(date) - 2.88e7 > lastUpdated)
      : getWikisUntil(username, type, page + 1, lastUpdated)
        .then(results => results.concat(wikis))
  ));
}

module.exports = function main(username, type, lastUpdated) {
  return checkUsername(username)
    .then(() => getWikisUntil(username, type, 1, lastUpdated))
    .then((wikis) => {
      const data = {};
      for (let i = 0; i < wikis.length; i++) {
        data[wikis[i]] = (data[wikis[i]] || 0) + 1;
      }
      return data;
    });
};
