const express = require('express');
const router = express.Router();

//controller
const homeController = require('app/http/controllers/homeController');
const commentController = require('app/http/controllers/comment/commentController');
const courseController = require('app/http/controllers/course/courseController');
const articleController = require('app/http/controllers/article/articleController');


//Home Routers
router.get('/' , homeController.index);



//logout
router.get('/logout' , (req , res)=>{
    req.logOut();
    res.clearCookie('remember_token');
    res.redirect('/');
});

//course
router.get('/course/:course' , homeController.coursePage);
router.get('/download/:id' , homeController.download);
router.get('/courses' , courseController.allCourse);

//article
router.get('/article/:article', homeController.articlePage);
router.get('/articles' , articleController.allArticle);

//comment
router.post('/comment' , commentController.comment);


// paymrnt
router.post('/course/payment', courseController.payment);
router.get('/course/payment/callbackurl', courseController.callbackurl);



// froum
router.get('/froum', homeController.froum);
router.get('/froumQue/:id', homeController.froumQue);
router.get('/froumAns/:id', homeController.froumAns);
router.post('/froumQue', homeController.createfroumQue);
router.post('/froumAns', homeController.createfroumAns);


module.exports = router;