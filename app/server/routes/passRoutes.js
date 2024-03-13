const controller = require( "../controllers" ).pass;

module.exports = app => {
    // app.get( "/pass.com.theroofgardens.membership/:memberId?:token", controller.pass );
    // app.get( "/pass.com.theroofgardens.membership/pass", controller.pass );
    // app.get( "/pass.com.theroofgardens.membership/test", controller.test );
    app.get( "/pass", controller.pass );
    app.get( "/test", controller.test );
};