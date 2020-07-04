const controller = require('app/http/controllers/controller');
const passport = require('passport');
class redirectAuthenticatedApi extends controller{

    handle(req , res , next){
        passport.authenticate('jwt', { session : false }, (err, user, msg) => {
            if( err || ! user )
                return res.json({
                    data : 'دسترسی مسدود شده است',
                    status : 'error'
                })

            next();
        }) (req, res, next)
    }
}

module.exports = new redirectAuthenticatedApi();