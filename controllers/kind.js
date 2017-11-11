const genSVG = require('../lib/svg.js');
const { KIND_MAP, StatusError } = require('../lib/utils.js');
const KindModel = require('../models/kind.js');

function intercept(_kind, _type) {
  let kind = _kind.toLowerCase();
  kind = kind === 'timelines' ? 'Timeline' : kind;
  kind = kind === 'wikis' ? 'Wiki' : kind;
  if (!Object.keys(KIND_MAP).includes(kind)) {
    throw new StatusError(404, 'Not Found');
  }
  const type = _type.toLowerCase();
  if (!Object.keys(KIND_MAP[kind].type).includes(type)) {
    throw new StatusError(404, 'Not Found');
  }
  return [kind, type];
}

async function getSVG(ctx, username, _kind, _type) {
  const data = await KindModel.get(username, ...intercept(_kind, _type));
  if (!data) {
    ctx.throw(404);
  }
  ctx.body = genSVG(data);
  ctx.type = 'svg';
  ctx.status = 200;
}

async function getJSON(ctx, username, _kind, _type) {
  const data = await KindModel.get(username, ...intercept(_kind, _type));
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
