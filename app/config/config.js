require("dotenv").config();

const { 
  PORT
} = process.env;

module.exports = {
  development: {
    serverPort: PORT || 8080,
  },
  test: {
    serverPort: PORT || 6000,
  },
  staging: {
    serverPort: PORT || 6000,
  },
  production: {
    serverPort: PORT || 6000
  },
};