const { Courses } = require('../../../configs/v1/mongoose-schema');

module.exports = {
  getAllCourseModels: (name, categorySearch, gte, lte, sortTypesort, limit, page) => {
    return new Promise((resolve, reject) => {
      Courses.find({
        name_course: { $regex: name, $options: 'i' },
        category: categorySearch,
        price: {
          $gte: gte,
          $lte: lte,
        },
      })
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
};
