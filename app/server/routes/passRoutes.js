const controller = require( "../controllers" ).pass;

module.exports = app => {
    // app.get( "/pass.com.theroofgardens.membership/:memberId?:token", controller.pass );
    // app.get( "/pass.com.theroofgardens.membership/pass", controller.pass );
    // app.get( "/pass.com.theroofgardens.membership/test", controller.test );
    app.get( "/v1/members/:memberId", controller.members );
    app.get( "/v1/pass/:memberId", controller.pass );
    app.get( "/v1/test", controller.test );
};