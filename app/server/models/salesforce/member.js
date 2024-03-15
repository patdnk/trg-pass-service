'use strict';

class Member {
  constructor (memberData) {
    this.id = memberData.id;
    this.memberId = memberData.memberId;
    this.name = memberData.name;
    this.firstName = memberData.firstName;
    this.lastName = memberData.lastName;
    this.type = memberData.type;
    this.email = memberData.email;
    this.dateOfBirth = memberData.dateOfBirth;
    this.dateOfJoining = memberData.dateOfJoining;
    this.checkIn = memberData.checkIn;
    this.isVip = memberData.isVip;
    this.status = memberData.status;
    this.icareId = memberData.icareId;
    }
}

module.exports = {
    Member,
};