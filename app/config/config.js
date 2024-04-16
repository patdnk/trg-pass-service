require("dotenv").config();

const { 
  PORT
} = process.env;

module.exports = {
  development: {
    serverPort: PORT || 3000,
    salesforce: {
      endpoint: 'https://kensingtonrg--trgpartial.sandbox.my.salesforce.com',
      user: 'pat.dynek@theroofgardens.com.apipart',
      password: 'pad@FMR2hfv@cpt6rpw',
      token: 'vSAYNnemSv6g2e5dIF3Qix4P'
    }
  },
  test: {
    serverPort: PORT || 3000,
    salesforce: {
      endpoint: 'https://kensingtonrg--trgpartial.sandbox.my.salesforce.com',
      user: 'pat.dynek@theroofgardens.com.apipart',
      password: 'pad@FMR2hfv@cpt6rpw',
      token: 'vSAYNnemSv6g2e5dIF3Qix4P'
    }
  },
  staging: {
    serverPort: PORT || 3000,
    salesforce: {
      endpoint: 'https://kensingtonrg--trgpartial.sandbox.my.salesforce.com',
      user: 'pat.dynek@theroofgardens.com.apipart',
      password: 'pad@FMR2hfv@cpt6rpw',
      token: 'vSAYNnemSv6g2e5dIF3Qix4P'
    }
  },
  production: {
    serverPort: PORT || 3000,
    salesforce: {
      endpoint: 'https://kensingtonrg--trgpartial.sandbox.my.salesforce.com',
      user: 'pat.dynek@theroofgardens.com.apipart',
      password: 'pad@FMR2hfv@cpt6rpw',
      token: 'vSAYNnemSv6g2e5dIF3Qix4P'
    }
  },
};