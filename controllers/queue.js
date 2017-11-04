const queue = require('../models/queue.js');

async function get(ctx) {
  const total = `total: ${queue.tasks.length}\n\n`;
  ctx.body = total + queue.tasks.map(({ id }) => id).join('\n');
  ctx.status = 200;
}

module.exports = {
  get,
};
