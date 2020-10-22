const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');
const { login } = require('./login');

module.exports.register = async (ctx, next) => {
    
    const reqName = ctx.request.body.displayName,
        reqEmail = ctx.request.body.email,
        reqPassword = ctx.request.body.password;

    const user = await User.findOne ({email: reqEmail});
     
    // creating User //
    const verificationToken = uuid ();
    const newUser = new User ({email: reqEmail,
                            displayName: reqName,
                            verificationToken: verificationToken});
    await newUser.setPassword (reqPassword);
    await newUser.save ();

    // sending Email //
    await sendMail ({
        template: 'confirmation',
        locals: {token: 'token'},
        to: reqEmail,
        subject: 'Подтвердите почту'
    });

    // sending Response //
    ctx.status = 200;
    ctx.body = {status: 'ok'};

};

module.exports.confirm = async (ctx, next) => {

    const user = await User.findOne ({verificationToken: ctx.request.body.verificationToken}) || null;

    if (!user) {
        ctx.throw (400, 'Ссылка подтверждения недействительна или устарела');
    } else {
        // deleting Token //
        user.verificationToken = undefined;
        user.save ();

        // generating sessionToken //
        const sessionToken = uuid ();

        // sending Response //
        ctx.status = 200;
        ctx.body = {token: ctx.login ()};
        
        return;
    }
};
