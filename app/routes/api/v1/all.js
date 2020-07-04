const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const courseController = require('app/http/controllers/api/v1/courseController');
const userController = require('app/http/controllers/api/v1/userController');
const redirectAuthenticatedApi = require('app/http/middleware/redirectAuthenticatedApi');


router.get('/jwt' , courseController.createToken);
router.get('/jwt/:token' , courseController.verifyToken);
router.get('/login' , userController.login);
router.get('/user' , redirectAuthenticatedApi.handle , userController.user);
router.get('/course/:course', courseController.course);



module.exports = router;