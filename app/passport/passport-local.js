const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('app/models/users');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local.register' , new localStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true,

} , (req , email , password , done) => {
    User.findOne({'email' : email} , (err , user)=>{
        if (err) return done(err);
        if (user) return done(err , false , req.flash('errors' , 'کاربری با این مشخصات وجود دارد !!!'));
        const adduser = new User({
            name : req.body.name ,
            email,
            password
        })
        adduser.save((err)=>{
            if (err) return done(err , false , req.flash('errors' , 'امکان ثبت اطلاعات کاربر وجود ندارد !!!'));
            done(null , adduser);
        })
    })
}))

passport.use('local.login' , new localStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true

} , (req , email , password , done)=>{
    User.findOne({'email' : email} , (err , user)=>{
        if (err) return done(err);
        if (! user || ! user.comparePassword(password)) return done(null , false , req.flash('errors' , 'کاربری با چنین مشخصات ثبت نشده است !!!'));
        done(null , user);
    })
}))