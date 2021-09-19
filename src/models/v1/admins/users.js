const { Users } = require('../../../configs/v1/mongoose-schema');

module.exports = {
  getAllModels: (name, sortTypesort, limit, page) => {
    return new Promise((resolve, reject) => {
      Users.find({ name_users: { $regex: name, $options: 'i' } })
        .sort(sortTypesort)
        .limit(limit)
        .skip(page)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  findCountIdModels: () => {
    return new Promise((resolve, reject) => {
      Users.find({})
        .count()
        .then((result) => resolve(result))
        .catch((err) => {
          reject(err);
        });
    });
  },
  softDelete: (id) => {
    return new Promise((resolve, reject) => {
      Users.findByIdAndUpdate(
        {
          _id: id,
        },
        { 'access.delete': true }
      )
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  deleteModels: (id) => {
    return new Promise((resolve, reject) => {
      Users.findByIdAndDelete({
        _id: id,
      })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
