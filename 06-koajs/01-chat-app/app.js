const path = require('path');
const Koa = require('koa');
const url = require ('url');
//const Static = require ('koa-static'); //

//const Router = require ('koa-router');

const app = new Koa();
//const static = new Static ();
//const router = new Router ();

let msgData = [];
let msgSubscribers = Object.create (null);
//let msgSubscribers = [];


// It works, but ...
app.use(require('koa-static')(path.join(__dirname, 'public')));
/*app.use (async (ctx, next) => {
    await next ();
});*/

// It works!
app.use(require('koa-bodyparser') ());
/*app.use (async (ctx, next) => {
    await next ();
});*/

const Router = require('koa-router');
const router = new Router ();

router.get('/subscribe', msgSubscribe);
router.post('/publish', msgPublish);
app.use(router.routes());

async function msgSubscribe (ctx, next) {
    

    //let id = url.parse (ctx.request.url).query.slice (2); //console.log (id);
    
    //console.log (ctx.request);

    //msgSubscribers[url.parse (ctx.request.url).query.slice (2)] = ctx;
    //console.log ('\n --- msgSubscribers --- \n');
    //console.log (msgSubscribers[id]);

    

    /*
    ctx.response.status = 200;
    console.log (ctx.response);
    console.log (msgSubscribers.length);
    */

    //sgSubscribers.push (id); //console.log (msgSubscribers.length); console.log ('msgSubscribers = ' + msgSubscribers); //console.log ('msgSubscribers' + '[ ' + id + ' ] = ' + msgSubscribers[id]);

    


   if (msgData.length > 0) {
       for (let i = 0; i < msgData.length; i++) {
        ctx.response.body = 'User' + Math.round (url.parse (ctx.request.url).query.slice (2) * 100) + ' => ' + msgData [i];
       }
    
    //msgData.length -=1;
    //publ (cont);
    } //else return;*/
    
    //ctx.response.body = '123';

    //console.log (ctx.request.path);
    //console.log (ctx.request.body);


}

/*
function publ (cont) {
    if (msgData.length > 0) {
        cont.response.body = msgData; // [msgData.length - 1];
        msgData.length -=1;
        //publ (cont);
    } else return;
}
*/

async function msgPublish (ctx, next) {
    //ctx.response.body = ctx.request.body;
    //console.log (ctx.response.body);

    //msgData[Math.random ()] = ctx.request.body.message;
    //console.log (ctx.request.body.message); //
    
    console.log ('\n --- msgPublish --- \n'); //
    if (!!ctx.request.body.message) {msgData.push (ctx.request.body.message);} else return;
    /*
    console.log ('msgData = ' + msgData);

    for (let id in msgSubscribers) {
        //msgSubscribers['333'] = ctx;
        if (msgData.length > 0) {
            console.log (msgSubscribers[id].response);
            msgSubscribers[id].response.status = 200;
            msgSubscribers[id].response.body = msgData [msgData.length - 1];
            msgData.length -=1;
            console.log (msgSubscribers[id].response);
        }
        
        ctx.response.body = '';
        return;*/
    }
    //console.log (msgSubscribers['1']);

    

    
    //console.log (msgData);
}

module.exports = app;

/*
function onAccept (req, res) {
    console.log ('------');
    console.log ('--- START ---');
    
    res.end ();

    console.log ('--- END ---');
    console.log ('------');

}
*/