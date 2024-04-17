const controller = require( "../controllers" ).pass;

module.exports = app => {
    //apple
    app.get( "/v1/pass/:memberId", controller.pass );
    // app.post( "/v1/devices/:deviceId/registrations/:passTypeId/:passSerialNumber", controller.passRegistrations );
    // app.get( "/v1/devices/:deviceId/registrations/:passTypeId?passesUpdatedSince=:previousLastUpdated", controller.passTimestampCheck );
    // app.get( "/v1/passes/:passTypeId/:passSerialNumber", controller.passUpdate );
    //google
    // app.get( " ");
};