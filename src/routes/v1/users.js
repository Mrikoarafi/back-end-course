const express = require('express');
const router = express.Router();
const users = require('../../controllers/v1/users/users');
const { authen, author } = require('../../helpers/v1/auth.js');

router.post('/register', users.registerEmail);
router.post('/reset-acclogin', users.changeAccLogin);
router.post('/confirm-acclogin/:hash', authen, author, users.confirmAccLogin);
router.post('/send_otp', users.registerSendOtp);
router.patch('/verify/:hash', users.verify);
router.post('/login', users.login);
router.get('/getdetails/:id', authen, author, users.getDetails);
// authen, author,
router.put('/update/:id', users.updateData);
router.get('/refresh-token', authen, author, users.renewToken);
router.post('/reset-password', users.resetPassword);
router.post('/confirm-password/:hash', authen, author, users.confirmPassword);
router.patch('/check_code/:hash', users.checkCodeVerify);
router.patch('/logout/:id', authen, author, users.logoutUsers);

module.exports = router;
