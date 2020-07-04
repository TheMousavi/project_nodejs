const validator = require('./validator');
const { check } = require('express-validator');
class resetPasswordValidator extends validator{
    handle(){
        return[

            check('email')
                .isEmail().withMessage('فرمت ایمیل رعایت نشده است. !!!'),
            check('password')
                .isLength({min:8}).withMessage('گذرواژه نمیتواند کمتر از 8 کاراکتر باشد. !!!')

        ]
    }
}

module.exports = new resetPasswordValidator();