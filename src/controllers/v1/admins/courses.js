const adminModels = require('../../../models/v1/admins/courses');
const upload = require('../../../helpers/v1/upload');
const cloudinary = require('../../../helpers/v1/cloudinary');
const { success, failed, errorServer } = require('../../../helpers/v1/response');

module.exports = {
  insertCouse: (req, res) => {
    try {
      upload.single('pict_course')(req, res, async (err) => {
        const data = req.body;
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            failed(res, [], 'File too large Max 1mb');
          } else {
            failed(res, [], 'File must be jpg & jpeg or png ');
          }
        } else {
          const resultImage = await cloudinary.uploader.upload(req.file.path);
          data.pict_course = !req.file ? 'default_course.jpg' : resultImage.public_id;
          const withPict = { ...data, pict_course: data.pict_course };
          adminModels
            .insertCouseModels(withPict)
            .then((result) => {
              success(res, result, `Success insert product`);
            })
            .catch((err) => {
              if (err === `{"name_course":1}`) {
                failed(res, [], 'Name course using');
              } else {
                failed(res, [], err);
              }
            });
        }
      });
    } catch (error) {
      errorServer(res, [], 'Internal server error');
    }
  },
  findCountCourse: (req, res) => {
    try {
      const data = req.query;
      adminModels
        .findCountCourseModels(data)
        .then((result) => {
          success(res, result, 'Count all courses');
        })
        .catch((err) => {
          failed(res, [], err.message);
        });
    } catch (error) {
      errorServer(res, [], 'Internal server error');
    }
  },
};
