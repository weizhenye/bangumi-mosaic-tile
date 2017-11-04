const Queue = require('../lib/queue.js');

const queue = new Queue({
  interval: 30 * 1e3,
  limit: 1000,
});

queue.start();

module.exports = queue;
