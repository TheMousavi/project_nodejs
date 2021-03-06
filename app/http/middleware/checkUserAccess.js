const middleware = require('app/http/middleware/middleware');
const Permission  = require('app/models/permission');

class checkUserAccess extends middleware{
    check(perm) {
        return async (req, res, next)=>{
            const permissions = await Permission.find({ name  : perm }).populate('roles').exec();
             //return res.json(permissions)
            permissions.forEach(permission => {
                let Roles = permission.roles.map(role => role._id);
                return req.user.hasRoles(Roles) ? next() : res.redirect('/admin')
            })
        }
    }
}

module.exports = new checkUserAccess();