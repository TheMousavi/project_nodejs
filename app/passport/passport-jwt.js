const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('app/models/users');



passport.use('jwt' , new JwtStrategy({

    jwtFromRequest : ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('token')
    ]),
    secretOrKey : config.jwt.secretkey

} , (jwt_payload ,  done) => {
    User.findOne({'_id' : jwt_payload._id} , (err , user)=>{
        if (err) return done(err);
        if (user) return done(null , user);
        else done(null , false , {message : 'دسترسی به اطلاعات کاربری مسدود شده است'})

    })
}))

