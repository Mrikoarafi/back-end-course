const coursesModels = require('../../../models/v1/users/courses');
const { failed, errorServer, successWithMeta } = require('../../../helpers/v1/response');

module.exports = {
  getAllCourse: (req, res) => {
    try {
      // search by name
      const name = !req.query.name_course ? /.*.*/ : req.query.name_course;
      const category = !req.query.category ? /.*.*/ : req.query.category;
      // dari 0 sampai 200000
      const gte = !req.query.gte ? 0 : req.query.gte;
      const lte = !req.query.lte ? 1000000 : req.query.lte;
      // sort field asc desc
      const sortTypesort = !req.query.sort && !req.query.typesort ? false : { [req.query.sort]: req.query.typesort };
      //limit
      const limit = !req.query.limit ? 9 : parseInt(req.query.limit);
      // page
      const page_limit = !req.query.limit ? 1 : parseInt(req.query.page);
      const page = page_limit === 1 ? 0 : (page_limit - 1) * limit;
      coursesModels
        .getAllCourseModels(name, category, gte, lte, sortTypesort, limit, page)
        .then((result) => {
          const totalRows = result.length; //banyak product
          const meta = {
            totalRows,
            //math ceil untuk membulatkan angka
            // totalPage: Math.ceil(totalRows / limit),
            page: page_limit,
          };
          // di frontend,insertedBy tidak di tampilkan jika lvl = 1
          successWithMeta(res, result, meta, 'Get all products success');
        })
        .catch((err) => {
          failed(res, [], err.message);
        });
    } catch (error) {
      errorServer(res, [], 'Internal server error');
    }
  },
};
