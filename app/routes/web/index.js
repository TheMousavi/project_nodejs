const express = require('express');
const router = express.Router();

const authRouters = require('./auth');
const homeRoutes = require('./home');
const adminRoutes = require('./admin');

//middleware
const redirectAuthenticated = require('app/http/middleware/redirectAuthenticated');
const redirectIfNotAuthenticated = require('app/http/middleware/redirectIfNotAuthenticated');
const checkError = require('app/http/middleware/checkError');


//home Router
router.use('/' , homeRoutes);

//Auth Router
router.use('/auth' ,redirectAuthenticated.handle ,  authRouters);

//admin Panel2
router.use('/admin', redirectIfNotAuthenticated.handle, adminRoutes);

// Error Routes
router.all('*', checkError.get404);
router.use(checkError.handle);

module.exports = router;