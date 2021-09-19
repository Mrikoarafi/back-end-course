const express = require('express');
const router = express.Router();
const auth = require('../../helpers/v1/auth');
const adminUsers = require('../../controllers/v1/admins/users');
const adminCourses = require('../../controllers/v1/admins/courses');

// courses
// auth.authen, auth.authenAdmin, auth.author,
router.post('/course/insert', adminCourses.insertCouse);
router.get('/course/find-count-course', auth.authen, auth.authenAdmin, auth.author, adminCourses.findCountCourse);

// users
router.get('/users/getall', auth.authen, auth.authenAdmin, auth.author, adminUsers.getAllusers);
router.get('/users/find-count', auth.authen, auth.authenAdmin, auth.author, adminUsers.findCountId);
router.get('/users/getqr', auth.authen, auth.authenAdmin, auth.author, adminUsers.qrcode);
// auth.authen, auth.authenAdmin, auth.author,
router.delete('/users/delete/:id', adminUsers.deleteId);
module.exports = router;
