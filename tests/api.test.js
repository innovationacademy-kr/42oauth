const got = require('got');
const AuthUtils = require('../common/AuthUtils');

test('api', async () => {
  const token = await getToken();
  expect(token.token_type).toBe('bearer');
});
test('accreditions', async () => {
  await getAccreditations();
});
test('campuses', async () => {
  await getCampuses();
});
async function getToken() {
  const token = await AuthUtils.getToken();
  return token;
}

async function getAccreditations() {
  const token = await getToken();
  const END_POINT_42_API = 'https://api.intra.42.fr';
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.access_token}`
    }
  };
  const res = await got.get(`${END_POINT_42_API}/v2/accreditations`, options);
  console.log(JSON.stringify(JSON.parse(res.body), null, 2));
}

async function getCampuses() {
  const token = await getToken();
  const END_POINT_42_API = 'https://api.intra.42.fr';
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.access_token}`
    }
  };
  const res = await got.get(`${END_POINT_42_API}/v2/campus`, options);
  console.log(JSON.stringify(JSON.parse(res.body), null, 2));
}
