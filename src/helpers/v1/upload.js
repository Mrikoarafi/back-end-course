const multer = require('multer');
const path = require('path');

module.exports = multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 1000000, //1mb
  },
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb('Image type must jpg,jpeg or png', false);
      return;
    }
    cb(null, true);
  },
});
