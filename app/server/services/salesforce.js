const jsforce = require("jsforce");
const env = process.env.NODE_ENV || "development";
const config = require('../../config/config.js')[env];
const { Member } = require( "../models" ).member;

const conn = new jsforce.Connection({
  loginUrl: config.salesforce.endpoint
});

async function getMemberDetails(memberId) {

  var member;

  try {
    let login = await conn.login(config.salesforce.user, config.salesforce.password + config.salesforce.token);
    try {
      let res = await conn.query("SELECT Id, Name, FirstName, LastName, Birthdate__pc, PersonEmail, iCare_Id__c, Member_Id__c, MemberStatus__pc, MemberType__pc, VIP__pc, Date_of_Joining__pc, CheckIn__pc FROM Account WHERE Member_Id__c = '" + memberId + "'");

      console.log("query result:" + res);
      console.log("total : " + res.totalSize);
      console.log("fetched : " + res.records.length);
      console.log(res);

      memberData = {
        "name": res.records[0].Name,
        "firstName": res.records[0].FirstName,
        "lastName": res.records[0].LastName,
        "id": res.records[0].Id,
        "memberId": res.records[0].Member_Id__c,
        "icareId": res.records[0].iCare_Id_c,
        "type": res.records[0].MemberType__pc,
        "email": res.records[0].PersonEmail,
        "dateOfBirth": res.records[0].Birthdate__pc,
        "status": res.records[0].MemberStatus__pc,
        "checkIn": res.records[0].CheckIn__pc,
        "isVip": res.records[0].VIP__pc,
        "dateOfJoining": res.records[0].Date_of_Joining__pc,
      };
      member = new Member(memberData);

    } catch (error) {

      const errorMessage = {
        "errorCode": "0999",
        "memberId": memberId,
        "status": "memberDoesNotExist"
      }
      console.error(error)
      throw (errorMessage);

    }

  } catch (error) {
    console.error("error: " + error);
    throw error;
  }
  return member;

}

module.exports = {
  getMemberDetails,
};