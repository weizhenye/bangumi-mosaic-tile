const genSVG = require('../lib/svg.js');
const { TIMELINE_TYPES, StatusError } = require('../lib/utils.js');
const TimelineModel = require('../models/timeline.js');

function intercept(type) {
  const t = type.toLowerCase();
  if (!TIMELINE_TYPES.includes(t)) {
    throw new StatusError(404, `Type ${t} is not supported.`);
  }
  return t;
}

async function getSVG(ctx, username, type) {
  const data = await TimelineModel.get(username, intercept(type));
  if (!data) {
    ctx.throw(404);
  }
  ctx.body = genSVG(data);
  ctx.type = 'svg';
  ctx.status = 200;
}

async function getJSON(ctx, username, type) {
  const data = await TimelineModel.get(username, intercept(type));
  if (!data) {
    ctx.throw(404);
  }
  ctx.body = data;
  ctx.status = 200;
}

module.exports = {
  getSVG,
  getJSON,
};
