const controller = require('app/http/controllers/controller');
class redirectifNotAuthenticated extends controller{
    handle(req,res,next){
        if(! req.isAuthenticated()) return res.redirect('/auth/login')
        next();
    }
}

module.exports = new redirectifNotAuthenticated();