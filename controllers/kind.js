const genSVG = require('../lib/svg.js');
const { KIND_MAP, StatusError } = require('../lib/utils.js');
const KindModel = require('../models/kind.js');

function intercept(_kind, _type, _ext) {
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
  const ext = _ext.toLowerCase();
  if (!['json', 'svg'].includes(ext)) {
    throw new StatusError(404, 'Not Found');
  }
  return [kind, type, ext];
}

async function get(ctx, username, _kind, _type, _ext) {
  const [kind, type, ext] = intercept(_kind, _type, _ext);
  const entity = await KindModel.get(username, kind, type);
  KindModel.tryUpdate(username, kind, type, entity);
  const { data } = entity;
  if (!data) {
    ctx.throw(404);
  }
  if (ext === 'svg') {
    ctx.body = genSVG(data);
    ctx.type = 'svg';
  } else {
    ctx.body = data;
  }
  ctx.status = 200;
}

module.exports = {
  get,
  intercept,
};
