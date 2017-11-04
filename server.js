const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const hbs = require('koa-hbs');
const mount = require('koa-mount');
const route = require('koa-route');
const serve = require('koa-static');

const config = require('./config.js');

const UserController = require('./controllers/user.js');
const TimelineController = require('./controllers/timeline.js');
const QueueController = require('./controllers/queue.js');

const app = new Koa();

app.use(compress());
app.use(conditional());
app.use(etag());
app.use(bodyParser());
app.use(hbs.middleware({
  viewPath: path.resolve(__dirname, './views'),
}));
app.use(mount('/assets', serve('./public')));

app.use(async (ctx, next) => {
  await next();
  ctx.set('Cache-Control', 'max-age=86400');
  ctx.set('Access-Control-Allow-Origin', '*');
});

app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404) {
      ctx.throw(404);
    }
  } catch (err) {
    console.error(err);
    ctx.status = err.status || 500;
    ctx.body = {
      error: {
        code: err.name,
        message: err.message,
      },
    };
  }
});

app.use(route.get('/users/:username', UserController.getHTML));
app.use(route.get('/users/:username/:type.json', TimelineController.getJSON));
app.use(route.get('/users/:username/:type.svg', TimelineController.getSVG));
app.use(route.get('/queues', QueueController.get));

app.listen(config.server, () => {
  const { host, port } = config.server;
  console.info(`Bangumi Mosaic Tile is running on ${host}:${port}.`);
});
