const env = require('./env');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const mailer = {
  inboxGmailRegist: (email, codeverify) => {
    try {
      const inboxGmail = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
      
          <style>
            @font-face {
              font-family: 'Montserrat';
              font-style: normal;
              font-weight: 400;
              src: url(https://fonts.gstatic.com/s/montserrat/v18/JTUSjIg1_i6t8kCHKm459WRhyzbi.woff2) format('woff2');
            }
      
            * {
              font-family: Montserrat;
            }
          </style>
        </head>
      
        <body>
          <div style="margin: 0; padding: 0">
            <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0" style="width: 100% !important">
              <tbody>
                <tr>
                  <td style="background-color: #eaf8f8" align="center">
                    <div style="background-color: rgb(255, 255, 255); width: 60%; margin-top: 30px; margin-bottom: 30px">
                      <table>
                        <tbody>
                          <tr>
                            <td style="margin: 0; line-height: 1; padding-top: 25px; color: #48bdbd; text-align: center; font-size: 38px">Online Learn Platform</td>
                          </tr>
                          <tr>
                            <td style="font-size: 18px; color: rgb(20, 20, 20); text-align: center">the best place to learn for your life</td>
                          </tr>
                          <tr>
                            <td style="padding-top: 20px; padding-bottom: 20px; color: rgb(20, 20, 20); text-align: center; margin-top: 25px; margin-bottom: 25px; letter-spacing: 5px; font-size: 60px">${codeverify}</td>
                          </tr>
                          <tr>
                            <td style="font-size: 14px; color: #393d47; text-align: center; color: rgb(0, 0, 0)">
                              <strong>Masukkan code verifikasi ke account OLP kamu</strong>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 25px; text-align: center; color: #808080; font-size: 14px">harap untuk tidak membagikan account</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
      </html>      
      `;

      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          // ENV
          user: env.EMAILGMAIL,
          pass: env.PASSGMAIL,
        },
      });
      let mailOptions = {
        from: '"Point Of Sales" <no-reply@gmail.com>',
        replyTo: 'muhamad.rikoarafi@gmail.com',
        to: email,
        subject: `Register account`,
        html: inboxGmail,
      };
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.log(err);
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
  inboxChangeEmail: (email, codeverify) => {
    try {
      const inboxGmail = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
      
          <style>
            @font-face {
              font-family: 'Montserrat';
              font-style: normal;
              font-weight: 400;
              src: url(https://fonts.gstatic.com/s/montserrat/v18/JTUSjIg1_i6t8kCHKm459WRhyzbi.woff2) format('woff2');
            }
      
            * {
              font-family: Montserrat;
            }
          </style>
        </head>
      
        <body>
          <div style="margin: 0; padding: 0">
            <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0" style="width: 100% !important">
              <tbody>
                <tr>
                  <td style="background-color: #eaf8f8" align="center">
                    <div style="background-color: rgb(255, 255, 255); width: 60%; margin-top: 30px; margin-bottom: 30px">
                      <table>
                        <tbody>
                          <tr>
                            <td style="margin: 0; line-height: 1; padding-top: 25px; color: #48bdbd; text-align: center; font-size: 38px">Online Learn Platform</td>
                          </tr>
                          <tr>
                            <td style="font-size: 18px; color: rgb(20, 20, 20); text-align: center">the best place to learn for your life</td>
                          </tr>
                          <tr>
                            <td style="padding-top: 20px; padding-bottom: 20px; color: rgb(20, 20, 20); text-align: center; margin-top: 25px; margin-bottom: 25px; letter-spacing: 5px; font-size: 60px">${codeverify}</td>
                          </tr>
                          <tr>
                            <td style="font-size: 14px; color: #393d47; text-align: center; color: rgb(0, 0, 0)">
                              <strong>Masukkan code verifikasi untuk mengubah email</strong>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 25px; text-align: center; color: #808080; font-size: 14px">harap untuk tidak membagikan account</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
      </html>
      `;
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          // ENV
          user: env.EMAILGMAIL,
          pass: env.PASSGMAIL,
        },
      });
      let mailOptions = {
        from: '"Point Of Sales" <no-reply@gmail.com>',
        replyTo: 'muhamad.rikoarafi@gmail.com',
        to: email,
        subject: `Change email`,
        html: inboxGmail,
      };
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          res.send('Nodemailer error');
        }
      });
    } catch (error) {
      failed(res, [], 'Internal server error');
    }
  },
  inboxGmailResetPass: (email, codeverify) => {
    try {
      const inboxGmail = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
      
          <style>
            @font-face {
              font-family: 'Montserrat';
              font-style: normal;
              font-weight: 400;
              src: url(https://fonts.gstatic.com/s/montserrat/v18/JTUSjIg1_i6t8kCHKm459WRhyzbi.woff2) format('woff2');
            }
      
            * {
              font-family: Montserrat;
            }
          </style>
        </head>
      
        <body>
          <div style="margin: 0; padding: 0">
            <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0" style="width: 100% !important">
              <tbody>
                <tr>
                  <td style="background-color: #eaf8f8" align="center">
                    <div style="background-color: rgb(255, 255, 255); width: 60%; margin-top: 30px; margin-bottom: 30px">
                      <table>
                        <tbody>
                          <tr>
                            <td style="margin: 0; line-height: 1; padding-top: 25px; color: #48bdbd; text-align: center; font-size: 38px">Online Learn Platform</td>
                          </tr>
                          <tr>
                            <td style="font-size: 18px; color: rgb(20, 20, 20); text-align: center">the best place to learn for your life</td>
                          </tr>
                          <tr>
                            <td style="padding-top: 20px; padding-bottom: 20px; color: rgb(20, 20, 20); text-align: center; margin-top: 25px; margin-bottom: 25px; letter-spacing: 5px; font-size: 60px">${codeverify}</td>
                          </tr>
                          <tr>
                            <td style="font-size: 14px; color: #393d47; text-align: center; color: rgb(0, 0, 0)">
                              <strong>Masukkan code verifikasi untuk mengubah password</strong>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 25px; text-align: center; color: #808080; font-size: 14px">harap untuk tidak membagikan account</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
      </html>      
      `;
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          // ENV
          user: env.EMAILGMAIL,
          pass: env.PASSGMAIL,
        },
      });
      let mailOptions = {
        from: '"Point Of Sales" <no-reply@gmail.com>',
        replyTo: 'muhamad.rikoarafi@gmail.com',
        to: email,
        subject: `Change password`,
        html: inboxGmail,
      };
      transporter.sendMail(mailOptions, (err) => {
        if (err) throw err;
      });
    } catch (error) {
      failed(res, [], 'Internal server error');
    }
  },
};
module.exports = mailer;
