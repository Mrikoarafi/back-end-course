const { Courses } = require('../../../configs/v1/mongoose-schema');

module.exports = {
  insertCouseModels: (data) => {
    return new Promise((resolve, reject) => {
      const insertCourse = new Courses(data);
      insertCourse
        .save()
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(JSON.stringify(err.keyPattern));
        });
    });
  },
  findCountCourseModels: (data) => {
    return new Promise((resolve, reject) => {
      Courses.find(data)
        .count()
        .then((result) => resolve(result))
        .catch((err) => {
          reject(err);
        });
    });
  },
};
