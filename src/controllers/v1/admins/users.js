const adminModels = require('../../../models/v1/admins/users');
const usersModels = require('../../../models/v1/users/users');
const sendWhatsapp = require('../../../helpers/v1/sendWhatsapp');
const path = require('path');
const { success, failed, successWithMeta, errorServer } = require('../../../helpers/v1/response');
const cloudinary = require('../../../helpers/v1/cloudinary');

module.exports = {
  getAllusers: (req, res) => {
    try {
      // search by name
      const name = !req.query.name_users ? /.*.*/ : req.query.name_users;
      // sort field asc desc
      const sortTypesort = !req.query.fieldSort && !req.query.sort && !req.query.ascdesc ? false : { [`${req.query.fieldSort}.${req.query.sort}`]: req.query.ascdesc };
      //limit
      const limit = !req.query.limit ? 5 : parseInt(req.query.limit);
      // page
      const page_limit = !req.query.limit ? 1 : parseInt(req.query.page);
      const page = page_limit === 1 ? 0 : (page_limit - 1) * limit;
      adminModels
        .getAllModels(name, sortTypesort, limit, page)
        .then((result) => {
          const totalRows = result.length; //banyak product
          const meta = {
            totalRows,
            //math ceil untuk membulatkan angka
            // totalPage: Math.ceil(totalRows / limit),
            page: page_limit,
          };
          successWithMeta(res, result, meta, 'Get all users success');
        })
        .catch((err) => {
          failed(res, [], err.message);
        });
    } catch (error) {
      errorServer(res, [], 'Internal server error');
    }
  },
  findCountId: (req, res) => {
    try {
      adminModels
        .findCountIdModels()
        .then((result) => {
          success(res, result, 'Count all users');
        })
        .catch((err) => {
          failed(res, [], err.message);
        });
    } catch (error) {
      errorServer(res, [], 'Internal server error');
    }
  },
  qrcode: (req, res) => {
    try {
      sendWhatsapp
        .qrcode()
        .then((result) => {
          console.log(result);
          // success(res, { qrcode: "123" }, "Success");
        })
        .catch((err) => {
          console.log(err);
        });
      res.sendFile(path.join(__dirname, '../../../../public/qrcode/v1/qrcode.html'));
    } catch (error) {
      errorServer(res, [], 'Internal server error');
    }
  },
  deleteId: (req, res) => {
    try {
      const id_users = req.params.id;
      usersModels.getDetailsModels(id_users).then((result) => {
        if (result.access.delete === false) {
          adminModels.softDelete(id_users).then(() => success(res, [], 'WARNING! Soft delete,deleted true'));
        } else if (result.access.delete === true) {
          adminModels
            .deleteModels(id_users)
            .then(async (result) => {
              await cloudinary.uploader.destroy(result.profile.pict_users);
              success(res, [], 'Delete users success');
            })
            .catch((err) => {
              failed(res, [], err.message);
            });
        }
      });
    } catch (error) {
      errorServer(res, [], 'Internal server error');
    }
  },
};
