require('dotenv').config();
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// Option 2: Passing parameters separately (other dialects)

class User extends Model { }
User.init({
  username: DataTypes.STRING,
  birthday: DataTypes.DATE
}, { sequelize, modelName: 'user' });

class Campus extends Model { }
Campus.init({
  data: DataTypes.JSON,
}, { sequelize, modelName: 'campus' });

  (async () => {
    await sequelize.sync();
    const jane = await User.create({
      username: 'janedoe',
      birthday: new Date(1980, 6, 20)
    });
    console.log(jane.toJSON());

    const seoul = await Campus.create({data:{
      "id": 29,
      "name": "Seoul",
      "time_zone": "Asia/Seoul",
      "language": {
        "id": 14,
        "name": "Korean",
        "identifier": "ko"
      },
      "users_count": 2010,
      "vogsphere_id": 19,
      "country": "Korea, Republic of",
      "address": "Gaepo Digital Innovation Park, 416, Gaepo-ro, Gangnam-gu,",
      "zip": "000000",
      "city": "Seoul",
      "website": "42seoul.kr",
      "facebook": "https://www.facebook.com/inno.aca/  ",
      "twitter": "https://twitter.com/inno_aca",
      "active": true,
      "email_extension": "42seoul.kr",
      "endpoint": {
        "id": 17,
        "url": "https://endpoint.42seoul.kr:4000",
        "description": "LDAP ENDPOINT 42 Seoul",
        "created_at": "2020-01-10T07:45:58.065Z",
        "updated_at": "2020-01-10T08:37:58.570Z"
      }
    }});
    console.log(seoul.toJSON());
  })();
