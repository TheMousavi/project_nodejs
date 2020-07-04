const express = require('express');
const router = express.Router();
const passport = require('passport');
//controller
const registerController = require('app/http/controllers/auth/registerController');
const loginController = require('app/http/controllers/auth/loginController');
const forgetPasswordController = require('app/http/controllers/auth/forgetPasswordController');
const resetPasswordController = require('app/http/controllers/auth/resetPasswordController');
//validator
const registerValidator = require('app/http/validators/registerValidator');
const loginValidator = require('app/http/validators/loginValidator');
const forgetPasswordValidator = require('app/http/validators/forgetpasswordValidator');
const resetPasswordValidator = require('app/http/validators/resetPasswordValidator');

//Register routes
router.get('/register' , registerController.showForm);
router.post('/register' , registerValidator.handle() ,  registerController.registerProcess);

//Login routes
router.get('/login' , loginController.showForm);
router.post('/login', loginValidator.handle() , loginController.loginProcess);

//google.Api
router.get('/google' , passport.authenticate('google' , {scope : ['email' , 'profile']}));
router.get('/google/callback' , passport.authenticate('google' , {successRedirect: '/' , failureRedirect:'/auth/login'}));

//password-reset
router.get('/password/reset' , forgetPasswordController.showForm);
router.post('/password/email' ,forgetPasswordValidator.handle() ,  forgetPasswordController.passwordResetLink);
router.get('/password/reset/:token' , resetPasswordController.showForm);
router.post('/password/reset' ,resetPasswordValidator.handle(), resetPasswordController.resetPasswordProcess);
module.exports = router;