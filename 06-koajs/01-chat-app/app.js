const path = require ('path');
const url = require ('url');
const Koa = require ('koa');
const Router = require ('koa-router');

const app = new Koa();
const router = new Router ();

let message = null;
let subscribers = {};

app.use(require('koa-static')(path.join(__dirname, 'public')));

app.use(require('koa-bodyparser') ());

app.use (async (ctx, next) => {
  try {
    await next ();
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = 'Internal error';
  }
});

router.get ('/subscribe', async (ctx, next) => {
  const id = !!(url.parse (ctx.request.url).query) ? url.parse (ctx.request.url).query.slice (2) : Math.random ();
  subscribers[id] = null;
  let interv = 0;

  await new Promise ((resolve) => {
    interv = setInterval (() => {
      if (subscribers[id] !== null) {
        resolve (subscribers[id]);
      }
    }, 200);
  }).then(() => {
    clearInterval (interv);
  });

  ctx.response.status = 200;
  ctx.response.body = message;
});

router.post ('/publish', async (ctx, next) => {
  message = ctx.request.body.message;
  if (!message) { return; }
  
  ctx.response.status = 200;

  for (const id in subscribers) {
    subscribers[id] = message;
  }
});

app.use (router.routes());

module.exports = app;