const fetch = require('node-fetch');
const genSVG = require('../lib/svg.js');
const KindModel = require('../models/kind.js');
const KindController = require('../controllers/kind.js');

module.exports = async (req, res) => {
  try {
    const { username, kind, type, ext, begin, end, direction } = req.query;
    const [_kind, _type, _ext] = KindController.intercept(kind, type, ext);
    fetch(`https://bangumi-mosaic-tile-cron.aho.im/users/${username}/${_kind}s/${_type}.json`).catch(() => {});
    const entity = await KindModel.get(username, _kind, _type);
    if (!entity) throw new Error(404);
    res.setHeader('Cache-Control', 'max-age=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (_ext === 'svg') {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(genSVG(entity.data, { begin, end, direction }));
    } else {
      res.json(entity.data);
    }
  } catch (err) {
    res.status(404);
    res.json({ error: { code: 404, message: 'Not Found' } });
  }
};
