
const validator = require('./validator');
const { check } = require('express-validator');
class forgetpasswordValidator extends validator{
    handle(){
        return[

            check('email')
                .isEmail().withMessage('فرمت ایمیل رعایت نشده است. !!!'),
        ]
    }
}

module.exports = new forgetpasswordValidator();