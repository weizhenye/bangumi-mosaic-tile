const Queue = require('../lib/queue.js');
const config = require('../config.js');

const queue = new Queue(config.queue);

queue.start();

module.exports = queue;
