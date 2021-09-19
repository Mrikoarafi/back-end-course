const { success, failed, tokenResult, errorServer } = require('../../../helpers/v1/response');
const cloudinary = require('../../../helpers/v1/cloudinary');
const usersModels = require('../../../models/v1/users/users');
const sendWhatsapp = require('../../../helpers/v1/sendWhatsapp');
const gmailRegist = require('../../../helpers/v1/sendEmail');
const upload = require('../../../helpers/v1/upload');
const env = require('../../../helpers/v1/env');
const numberFormat = require('../../../helpers/v1/formatnumber');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
  registerEmail: (req, res) => {
    try {
      upload.single('pict_users')(req, res, async (err) => {
        const body = req.body;
        body.number_users = numberFormat.numberMongo(body.number_users);
        // upload picture
        const email = body.email;
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            failed(res, [], 'File too large Max 1mb');
          } else {
            failed(res, [], 'File must be jpg & jpeg or png ');
          }
        } else if (body.password.length < 6 || body.password.length > 20) {
          failed(res, [], 'Password min 6 & max 20 Character');
        } else {
          // ubah ke bcrypt passwordnya,10 salt nya(keunikan tingkat 10 bcrypt)
          const hashPass = await bcrypt.hash(body.password, 10);
          // ubah password ke bentuk bcrypt
          body.password = hashPass;
          const codeverify = Math.floor(Math.random() * 8999) + 1000;
          body.codeverify = codeverify;
          const resultImage = await cloudinary.uploader.upload(req.file.path);
          body.pict_users = !req.file ? 'default.jpg' : resultImage.public_id;
          usersModels
            .registerModels(body)
            .then((result) => {
              // untuk link
              const hashEmail = jwt.sign(email, env.JWTSECRET_USERS);
              gmailRegist.inboxGmailRegist(email, codeverify);
              success(res, { _id: result._id, linkhash: hashEmail }, `New User Success,please check your email for activation`);
            })
            .catch(async (err) => {
              if (err === `{"profile.name_users":1}`) {
                failed(res, [], 'Name using');
              } else if (err === `{"contact.number_users":1}`) {
                failed(res, [], 'Number using');
              } else if (err === `{"contact.email":1}`) {
                failed(res, [], 'Email using');
              } else {
                failed(res, [], err);
              }
              await cloudinary.uploader.destroy(resultImage.public_id);
            });
        }
      });
    } catch (error) {
      errorServer(res, [], 'Internal server error');
    }
  },
  changeAccLogin: (req, res) => {
    try {
      const user = req.body;
      usersModels
        .loginModels(user)
        .then((resultData) => {
          if (resultData.access.verify != 1) {
            failed(res, [], 'Account not active');
          } else {
            const codeverify = Math.floor(Math.random() * 8999) + 1000;
            if (resultData.contact.email === user.user) {
              const id = resultData._id;
              const email = resultData.contact.email;
              const hashEmail = jwt.sign(user.user, env.JWTSECRET_USERS);
              usersModels.changeAccLoginModels(id, codeverify).then(() => {
                gmailRegist.inboxChangeEmail(email, codeverify);
                success(res, { _id_users: resultData._id, hashEmail }, 'Check your email to see code');
              });
            } else if (resultData.contact.number_users === numberFormat.numberMongo(user.user)) {
              const id = resultData._id;
              usersModels.changeAccLoginModels(id, codeverify).then(() => {
                const hashNumber = jwt.sign(user.user, env.JWTSECRET_USERS);
                const message = `Masukkan code untuk mengganti nomor account anda, berikut adalah code verifikasi (OTP) ${codeverify}`;
                sendWhatsapp
                  .sendOtp(numberFormat.numberWebWhatsapp(user.user), message)
                  .then((result) => {
                    success(res, { _id_users: resultData._id, linkhash: hashNumber, ...result }, 'Success send OTP,Check your whatsapp');
                  })
                  .catch((err) => {
                    errorServer(res, [], err);
                  });
              });
            }
          }
        })
        .catch((error) => errorServer(res, [], 'Your account unknown'));
    } catch (error) {
      errorServer(res, [], 'Internal server error');
    }
  },
  confirmAccLogin: (req, res) => {
    try {
      const hash = req.params.hash;
      const dataInput = req.body;
      const valuesData = Object.values(dataInput).toString();
      if (valuesData === '') {
        failed(res, [], 'Fill input');
      } else {
        jwt.verify(hash, env.JWTSECRET_USERS, (err, uncode) => {
          if (err) {
            failed(res, [], "Your account hasn't been registered");
          } else {
            const data = { user: uncode };
            usersModels
              .loginModels(data)
              .then((result) => {
                const id = result._id;
                usersModels
                  .confirmAccLoginModels(id, dataInput)
                  .then(() => {
                    success(res, [], 'Success change');
                  })
                  .catch((err) => {
                    failed(res, [], err.message);
                  });
              })
              .catch(() => {
                failed(res, [], 'Account unknown');
              });
          }
        });
      }
    } catch (err) {
      failed(res, [], 'Server internal error');
    }
  },
  registerSendOtp: (req, res) => {
    try {
      upload.single('pict_users')(req, res, async (err) => {
        const body = req.body;
        body.number_users = numberFormat.numberMongo(body.number_users);
        // upload picture
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            failed(res, [], 'File too large Max 1mb');
          } else {
            failed(res, [], 'File must be jpg & jpeg or png ');
          }
        } else if (body.password.length < 6 || body.password.length > 20) {
          failed(res, [], 'Password min 6 & max 20 Character');
        } else {
          // ubah ke bcrypt passwordnya,10 salt nya(keunikan tingkat 10 bcrypt)
          const hashPass = await bcrypt.hash(body.password, 10);
          // ubah password ke bentuk bcrypt
          body.password = hashPass;
          const codeverify = Math.floor(Math.random() * 8999) + 1000;
          body.codeverify = codeverify;
          const resultImage = await cloudinary.uploader.upload(req.file.path);
          body.pict_users = !req.file ? 'default.jpg' : resultImage.public_id;

          usersModels
            .registerModels(body)
            .then((resultRegist) => {
              // untuk link
              const hashEmail = jwt.sign(body.number_users, env.JWTSECRET_USERS);
              const message = `Masukkan code untuk mengaktifkan akun mu, berikut adalah code verifikasi (OTP) ${codeverify}`;
              sendWhatsapp
                .sendOtp(numberFormat.numberWebWhatsapp(req.body.number_users), message)
                .then((result) => {
                  success(res, { _id_users: resultRegist._id, linkhash: hashEmail, ...result }, 'Success send OTP,Check your whatsapp');
                })
                .catch((err) => {
                  errorServer(res, [], err);
                });
            })
            .catch(async (err) => {
              if (err === `{"profile.name_users":1}`) {
                failed(res, [], 'Name using');
              } else if (err === `{"contact.number_users":1}`) {
                failed(res, [], 'Number using');
              } else if (err === `{"contact.email":1}`) {
                failed(res, [], 'Email using');
              } else {
                failed(res, [], err.message);
              }
              await cloudinary.uploader.destroy(resultImage.public_id);
            });
        }
      });
    } catch (error) {
      errorServer(res, [], 'Internal server error');
    }
  },
  verify: (req, res) => {
    try {
      const linkHash = req.params.hash;
      jwt.verify(linkHash, env.JWTSECRET_USERS, (err, uncode) => {
        if (err) {
          failed(res, [], "Your account hasn't been registered");
        } else {
          // di ambil data yang sudah di uncode
          let data = { user: uncode };
          usersModels
            .loginModels(data)
            .then((result) => {
              if (result.access.codeverify === null) {
                failed(res, [], 'Codeverify null');
              } else if (result.access.codeverify === req.body.codeverify) {
                usersModels
                  .verifyModels(data)
                  .then(() => {
                    success(res, { id: result._id }, 'Success verify account');
                  })
                  .catch((err) => {
                    failed(res, [], err.message);
                  });
              } else {
                failed(res, [], 'Your code unknown');
              }
            })
            .catch(() => {
              failed(res, [], 'Unknown code');
            });
        }
      });
    } catch (error) {
      errorServer(res, [], 'Internal server error');
    }
  },
  login: async (req, res) => {
    const data = req.body;
    try {
      usersModels.loginModels(data).then(async (result) => {
        if (result != null) {
          const id = result._id;
          if (result.access.verify === 1) {
            // merubah password ke bentuk asli,di await untuk menunggu
            const passwordUncrypt = await bcrypt.compare(req.body.password, result.access.password);
            if (passwordUncrypt) {
              // token untuk mengakses API di timer 3600 dan akan expired
              jwt.sign(
                // email di rubah menjadi token
                {
                  email: result.contact.email,
                },
                env.JWTSECRET_USERS,
                {
                  expiresIn: 3600,
                },
                (err, token) => {
                  if (err) {
                    errorServer(res, [], err.message);
                  } else {
                    const refreshToken = jwt.sign({ id }, env.JWTSECRET_USERS);
                    if (result.access.refreshtoken === null) {
                      usersModels
                        .updateRefreshToken(refreshToken, id)
                        .then(() => {
                          const data = {
                            id: result._id,
                            token,
                            level: result.access.level,
                            refreshToken,
                          };

                          tokenResult(res, data, `Success login`);
                        })
                        .catch((err) => {
                          failed(res, [], err.message);
                        });
                    } else {
                      const data = {
                        id,
                        token,
                        level: result.access.level,
                        refreshToken: result.access.refreshtoken,
                      };
                      tokenResult(res, data, `Success login`);
                    }
                  }
                }
              );
            } else {
              failed(res, [], 'Password wrong');
            }
          } else {
            failed(res, [], 'not verified');
          }
        } else {
          failed(res, [], 'not registered');
        }
      });
    } catch (error) {
      errorServer(res, [], 'Internal server error');
    }
  },
  renewToken: (req, res) => {
    try {
      // samain kaya di postman refreshToken
      const refreshToken = req.body.refreshToken;
      usersModels
        .renewTokenModels(refreshToken)
        .then((result) => {
          if (result != null) {
            const newToken = jwt.sign(
              {
                email: result.contact.email,
              },
              env.JWTSECRET_USERS,
              {
                expiresIn: 3600,
              }
            );
            const data = {
              token: newToken,
              refreshToken: refreshToken,
            };
            tokenResult(res, data, 'Success,Token new');
          } else {
            failed(res, [], 'Refresh token not found,logout');
          }
        })
        .catch((err) => {
          failed(res, [], err);
        });
    } catch (error) {
      failed(res, [], 'Internal Server Error');
    }
  },
  logoutUsers: (req, res) => {
    const id = req.params.id;
    try {
      usersModels
        .logoutUsersModels(id)
        .then((result) => {
          success(res, result, 'Logout success');
        })
        .catch((err) => {
          failed(res, [], err.message);
        });
    } catch (error) {
      errorServer(res, [], 'Internal server error');
    }
  },
  resetPassword: (req, res) => {
    try {
      const user = req.body.user;
      usersModels
        .resetPasswordModels(user)
        .then(async (resultUser) => {
          if (resultUser != null) {
            // untuk codeverify
            const codeverify = Math.floor(Math.random() * 8999) + 1000;
            usersModels
              .resetPasswordModels(user, codeverify)
              .then(() => {
                if (resultUser.contact.email === user) {
                  gmailRegist.inboxGmailResetPass(user, codeverify);
                } else if (resultUser.contact.number_users === numberFormat.numberMongo(user)) {
                  const message = `WASPADA SEGALA PENIPUAN!\nMasukkan code untuk mengaktifkan akun mu, berikut adalah code verifikasi (OTP) ${codeverify}`;
                  sendWhatsapp.sendOtp(numberFormat.numberWebWhatsapp(user), message);
                }
                const linkChange = jwt.sign(user, env.JWTSECRET_USERS);
                success(res, { id: resultUser._id, linkChange }, `Success,Please check for see code`);
              })
              .catch((err) => {
                failed(res, [], err.message);
              });
          } else {
            failed(res, [], `Data invalid`);
          }
        })
        .catch((err) => {
          failed(res, [], err.message);
        });
    } catch (error) {
      errorServer(res, [], 'Internal server error');
    }
  },
  checkCodeVerify: (req, res) => {
    try {
      const codeverify = req.body.codeverify;
      const hash = req.params.hash;
      jwt.verify(hash, env.JWTSECRET_USERS, (err, uncode) => {
        if (err) {
          failed(res, [], "Your account hasn't been registered");
        } else {
          const data = { user: uncode };
          usersModels.loginModels(data).then((result) => {
            if (!result) {
              failed(res, [], 'Account dont know');
            } else if (result.access.codeverify != codeverify) {
              failed(res, [], 'Wrong code');
            } else {
              usersModels
                .checkCodeVerifyModels(data)
                .then(() => {
                  // buat token untuk akses ubah password
                  jwt.sign(
                    // user di rubah menjadi token
                    {
                      hash: data.user,
                    },
                    env.JWTSECRET_USERS,
                    {
                      expiresIn: 3600,
                    },
                    (err, tokenChangeAuth) => {
                      if (err) {
                        failed(res, [], err.message);
                      } else {
                        success(
                          res,
                          {
                            id: result._id,
                            tokenChangeAuth,
                            urlChangePass: hash,
                          },
                          'Change acc auth'
                        );
                      }
                    }
                  );
                })
                .catch((error) => {
                  failed(res, [], error.message);
                });
            }
          });
        }
      });
    } catch (err) {
      failed(res, [], 'Server internal error');
    }
  },
  confirmPassword: (req, res) => {
    try {
      const body = req.body;
      const hash = req.params.hash;
      jwt.verify(hash, env.JWTSECRET_USERS, (err, uncode) => {
        if (err) {
          failed(res, [], "Your account hasn't been registered");
        } else {
          const data = { user: uncode };
          usersModels.loginModels(data).then(async (result) => {
            if (!result) {
              failed(res, { email: uncode }, 'Pliss registered your account');
            } else {
              if (body.password !== body.confirmPassword || body.password.length < 6) {
                failed(res, [], 'Your password not same & min 6 character');
              } else {
                // hash by bcrypt
                const hashPass = await bcrypt.hash(body.password, 10);
                // untuk find di mongodb
                body.user = data.user;
                body.password = hashPass;
                usersModels
                  .confirmPasswordModels(body)
                  .then((result) => {
                    success(res, result, `Password has been changed,delete tokenchangepass`);
                  })
                  .catch((err) => {
                    errorServer(res, [], err.message);
                  });
              }
            }
          });
        }
      });
    } catch (err) {
      failed(res, [], 'Server internal error');
    }
  },
  getDetails: (req, res) => {
    try {
      // menangkap id di parameter link
      const id = req.params.id;
      usersModels
        .getDetailsModels(id)
        .then((result) => {
          success(res, result, 'Success Get Details');
        })
        .catch((err) => {
          failed(res, [], 'Id unknown');
        });
    } catch (error) {
      errorServer(res, [], 'Internal server error');
    }
  },
  updateData: (req, res) => {
    try {
      upload.single('pict_users')(req, res, (err) => {
        // check error
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            failed(res, [], 'File too large Max 1mb');
          } else {
            failed(res, [], 'File must be jpg & jpeg or png ');
          }
        } else {
          const id = req.params.id;
          const request = req.body;
          // masukkan file ke body
          const insertPict = async () => {
            // inisial file
            const resultImage = await cloudinary.uploader.upload(req.file.path);
            const file = !req.file ? false : resultImage.public_id;
            if (file != false) {
              // buat object file
              const filePict = { 'profile.pict_users': file };
              // masukkan ke request/req.body
              const obj = { ...request, ...filePict };
              return obj;
            } else {
              return request;
            }
          };
          let newObj = insertPict();
          usersModels
            .updateDataModels(newObj, id)
            .then(async (dataUpdate) => {
              if (!req.file || dataUpdate.profile.pict_users === 'default.jpg') {
                success(res, dataUpdate, 'Success update Product no image');
              } else {
                await cloudinary.uploader.destroy(dataUpdate.profile.pict_users);
                success(res, dataUpdate, 'Success update Product with image');
              }
            })
            .catch(async (err) => {
              if (err === `{"profile.name_users":1}`) {
                failed(res, [], 'Name using');
              } else if (err === `{"contact.number_users":1}`) {
                failed(res, [], 'Number using');
              } else if (err === `{"contact.email":1}`) {
                failed(res, [], 'Email using');
              } else {
                failed(res, [], 'Id unknown');
              }
              await cloudinary.uploader.destroy(dataUpdate.profile.pict_users);
            });
        }
      });
    } catch (error) {
      errorServer(res, [], 'Internal server error');
    }
  },
};
