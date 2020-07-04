const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('./../models/users');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
        clientID : config.service.GOOGLE.CLIENT_ID,
        clientSecret: config.service.GOOGLE.CLIENT_SECRET,
        callbackURL: config.service.GOOGLE.callback_URL

    }, (token, refreshToken, profile, done) => {
        User.findOne({'email' : profile.emails[0].value} , (err , user)=>{
            if(err) return done(err);
            if(user) return done(null ,user);

            const newuser = new User({
                name : profile.displayName,
                email : profile.emails[0].value,
                password : profile.id
            })

            newuser.save(err => {
                if(err) console.log(err);
                done(null, newuser);
            })
        })
    }
));