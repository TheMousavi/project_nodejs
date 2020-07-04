const controller = require('./controller');
const Course = require('app/models/course');
const Category = require('app/models/category');
const Article = require('app/models/article');
const Episode = require('app/models/episode');
const Froum = require('app/models/froum');
const FroumQue = require('app/models/froumQue');
const FroumAns = require('app/models/froumAns');
const path = require('path');
const bcrypt = require('bcrypt');
const moment = require('moment-jalaali');

moment.loadPersian({usePersianDigits : true , dialect : 'persian-modern'});



class homeController extends controller{
    async index(req , res){
        const courses = await Course.find({}).sort({createAt : 1}).limit(6).exec();
        const articles = await Article.find({}).sort({ createdAt: 1 }).limit(3).exec();
        //return res.json(course);
        res.render('index' , {courses , articles});
    }

    async coursePage(req , res , next){
        const course = await Course.findOneAndUpdate({ slug : req.params.course } , { $inc : { viewCount : 1}}).populate([{
                path: 'user',
                select: 'name',
            } , {
                path : 'episodes'
            } , {
                path : 'comments',
                match : {
                    check : true,
                    parent : null
                },
                populate : [{
                    path : 'user',
                    select : 'name'
                } , {
                    path : 'comments',
                    match : {
                        check:true
                    },populate : {
                        path : 'user',
                        select : 'name'
                    }
                }]
            },


        ]).exec();

        const categories = await Category.find({parent : null}).populate('childs').exec();
        //let time = moment(course.createAt).format('jD jMMMM jYYYY');
        //return res.json(course);
        //const accessUser = await this.accessUser(req , course);
        res.render('home/page/coursePage' , {course  , categories});
    }


    async articlePage(req, res, next) {
        const article = await Article.findOneAndUpdate({ slug: req.params.article }, { $inc : { viewCount : 1 }}).populate([{
            path : 'user',
            select : 'name'
        } , {
            path : 'comments',
            match : {
                check : true,
                parent : null
            },
            populate : [{
                path : 'user',
                select : 'name'
            }, {
                path : 'comments',
                match : {
                    check : true
                },populate : {
                    path : 'user',
                    select : 'name'
                }
            }]
        },


        ]).exec();
        //let time = moment(article.createAt).format('jD jMMMM jYYYY');
        const categories = await Category.find({parent : null}).populate('childs').exec();
        res.render('home/page/articlePage', { article , categories });
    }


    // accessUser(req , course) {
    //     let access = false;
    //     // if (req.isAuthenticated()){
    //     //     if (course.type == 'vip'){
    //     //         access = req.user.isVip();
    //     //     } else if (course.type == 'cash'){
    //     //         access = req.user.payCash(course);
    //     //     } else {
    //     //         access = true;
    //     //     }
    //     // }
    //   if (req.isAuthenticated()) {
    //       switch (course.type) {
    //           case 'vip' :
    //               access = req.user.isVip();
    //               break;
    //           case 'cash' :
    //               access = req.user.payCash(course);
    //               break;
    //           default:
    //               access = true;
    //               break;
    //       }
    //   }
    //     return access;
    // }

    async download(req , res , next){
        const episode = await  Episode.findById(req.params.id);
        if (! episode) return res.json('ویدئویی برای این دوره وجود ندارد !');
        if (! this.checkSecretUrl(req , episode)) {
            return res.json('لینک دانلود منقضی شده است .');
        }

        episode.inc('downloadCount');
        const filePath = await path.resolve(`./public/${episode.videoUrl}`);


        res.download(filePath);
    }

    checkSecretUrl(req , episode){
        const time = new Date().getTime();
        if (req.query.t < time) {
            return res.json('لینک دانلود منقضی شده است .');

        }
        const secert = `asdqwoidjopedm!@sdfwe#asd%${episode.id}${req.query.t}`;
        return bcrypt.compareSync(secert , req.query.secret);
    }

    //froum

    async froum(req, res, next) {
        try {
            const froums = await Froum.paginate({}, {limit : 10, sort : { createdAt : 1}, populate : { path : 'questions'}});
            res.render('home/page/froum/froum' , { froums });
        } catch (err) {
            next(err)
        }
    }

    async froumQue(req, res, next) {
        try {
            const Ques = await FroumQue.paginate({}, { limit : 10, sort : { createdAt : 1 }});
            res.render('home/page/froum/froumQue', { Ques });
        } catch (err) {
            next(err)
        }
    }

    async froumAns(req, res, next) {
        const Que = await FroumQue.findById(req.params.id);
        //return res.json(Que);
        const Anss = await FroumAns.paginate({ question : req.params.id }, { limit : 10 , sort : { createdAt : 1}, populate : { path : 'user' , selcet : 'name'}});
        //return res.json(Que);
        res.render('home/page/froum/froumAns', { Anss, Que });
    }


    async createfroumQue(req, res, next) {
        try {
            const froum = await Froum.findById(req.body.froum);
            //return res.json(froum);
            const addQue = new FroumQue({
                user : req.user.id,
                ...req.body
            })

            await addQue.save();

            this.alert(req, {
                text : `سوال شما در انجمن ${froum.title}`,
                type : "success"
            })

            res.redirect(`/froumQue/${req.body.froum}`);
        } catch (err) {
            next(err)
        }
    }

    async createfroumAns(req, res, next) {
        try {
            const question = await FroumQue.findById(req.body.question);
            //return res.json(question);
            const addAns = new FroumAns({
                user : req.user.id,
                ...req.body
            })

            const user = await FroumAns.findOne({ question : req.body.question,user : req.user.id });
            if(user != null) {
                await addAns.save();
                question.inc('countAns');
            } else {
                await addAns.save();
                await question.inc('countAns');
                await question.inc('countUser');
            }

            this.alert(req, {
                text : `پاسخ شما برای سوال ${question.title} ثبت شد`,
                type : 'success'
            })

            res.redirect(`/froumAns/${req.body.question}`)
        } catch (err) {
            next(err)
        }

    }
}
module.exports = new homeController();