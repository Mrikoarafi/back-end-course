const { Users } = require('../../../configs/v1/mongoose-schema');
const numberFormat = require('../../../helpers/v1/formatnumber');

module.exports = {
  registerModels: (data) => {
    return new Promise((resolve, reject) => {
      const register = new Users({
        profile: {
          name_users: data.name_users,
          pict_users: data.pict_users,
          bio: data.bio,
        },
        contact: {
          number_users: data.number_users,
          location: data.location,
          email: data.email,
        },
        access: {
          password: data.password,
          codeverify: data.codeverify,
          verify: data.verify,
          level: data.level,
          refreshtoken: data.refreshtoken,
        },
      });
      register
        .save()
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(JSON.stringify(err.keyPattern));
        });
    });
  },
  changeAccLoginModels: (id, codeverify) => {
    return new Promise((resolve, reject) => {
      Users.updateOne({ _id: id }, { 'access.codeverify': codeverify })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  confirmAccLoginModels: (id, data) => {
    return new Promise((resolve, reject) => {
      Users.updateOne({ _id: id }, data)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  verifyModels: (data) => {
    return new Promise((resolve, reject) => {
      Users.updateOne(
        {
          $or: [
            {
              'contact.email': data.user,
            },
            {
              'contact.number_users': data.user,
            },
          ],
        },
        {
          $set: {
            'access.codeverify': null,
            'access.verify': 1,
          },
        }
      )
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  loginModels: (data) => {
    return new Promise((resolve, reject) => {
      Users.findOne({
        $or: [
          {
            'contact.email': data.user,
          },
          {
            'contact.number_users': numberFormat.numberMongo(data.user),
          },
        ],
      })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  updateRefreshToken: (token, id) => {
    return new Promise((resolve, reject) => {
      Users.updateOne(
        {
          _id: id,
        },
        { $set: { 'access.refreshtoken': token } }
      )
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  renewTokenModels: (refreshToken) => {
    return new Promise((resolve, reject) => {
      Users.findOne({
        'access.refreshtoken': refreshToken,
      })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  logoutUsersModels: (id) => {
    return new Promise((resolve, reject) => {
      Users.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            'access.refreshtoken': null,
          },
        }
      )
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  resetPasswordModels: (data, codeverify) => {
    return new Promise((resolve, reject) => {
      Users.findOneAndUpdate(
        { $or: [{ 'contact.email': data }, { 'contact.number_users': numberFormat.numberMongo(data) }] },
        {
          $set: {
            'access.codeverify': codeverify,
          },
        }
      )
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  checkCodeVerifyModels: (data) => {
    return new Promise((resolve, reject) => {
      Users.updateOne(
        { $or: [{ 'contact.email': data.user }, { 'contact.number_users': numberFormat.numberMongo(data.user) }] },
        {
          'access.codeverify': null,
        }
      )
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  confirmPasswordModels: (data) => {
    return new Promise((resolve, reject) => {
      Users.findOneAndUpdate(
        { $or: [{ 'contact.email': data.user }, { 'contact.number_users': numberFormat.numberMongo(data.user) }] },
        {
          'access.password': data.password,
          'access.verify': 1,
        }
      )
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getDetailsModels: (id) => {
    return new Promise((resolve, reject) => {
      Users.findById(id)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  updateDataModels: (newObj, id) => {
    return new Promise((resolve, reject) => {
      Users.findOneAndUpdate({ _id: id }, newObj)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(JSON.stringify(err.keyPattern));
        });
    });
  },
};
