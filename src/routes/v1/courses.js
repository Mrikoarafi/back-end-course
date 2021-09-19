const express = require('express');
const router = express.Router();
const courses = require('../../controllers/v1/users/courses');
const { authen, author } = require('../../helpers/v1/auth.js');

router.get('/getall', authen, author, courses.getAllCourse);

module.exports = router;
