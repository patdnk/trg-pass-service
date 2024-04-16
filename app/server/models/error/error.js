'use strict';

class Error {
  constructor (errorData) {
    this.code = errorData.code;
    this.status = errorData.status;
    this.description = errorData.description;
    this.result = errorData.result;
    }
}

module.exports = {
    Error,
};