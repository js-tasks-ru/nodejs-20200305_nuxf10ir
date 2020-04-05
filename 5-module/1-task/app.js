const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const subscribers = new Set();

router.get('/subscribe', async (ctx, next) =>
  new Promise((resolve) => {
    subscribers.add(resolve);
    ctx.req.on('aborted', () => {
      subscribers.delete(resolve);
      resolve();
    });
  })
      .then((message) => {
        ctx.body = message;
      })
);

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;
  !message && ctx.throw(400);
  subscribers.forEach((resolver) => resolver(message));
  subscribers.clear();
  ctx.body = 'sent';
});

app.use(router.routes());

module.exports = app;
