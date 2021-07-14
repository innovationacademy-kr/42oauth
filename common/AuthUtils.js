require('dotenv').config();
const axios = require('axios');
const END_POINT_42_API = 'https://api.intra.42.fr';
const AuthUtils = {
  getToken: async function () {
    const data = {
      grant_type: 'client_credentials',
      client_id: process.env.FORTYTWO_CLIENT_ID,
      client_secret: process.env.FORTYTWO_CLIENT_SECRET
    };
    try {
      const res = await axios(END_POINT_42_API + '/oauth/token',
        {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          data: JSON.stringify(data)
        });
      if (res) {
        return res.data;
      }
    }
    catch (err) {
      console.log(err);
      throw err;
    };
  }

};

module.exports = AuthUtils;
