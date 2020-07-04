const validator = require('./validator');
const { check } = require('express-validator');
class registerValidator extends validator{
    handle(){
        return[
            check('name')
                .isLength({min:6}).withMessage('فیلد نام نمیتواند کمتر از 6 کاراکتر باشد. !!!'),
            check('email')
                .isEmail().withMessage('فرمت ایمیل رعایت نشده است. !!!'),
            check('password')
                .isLength({min:8}).withMessage('گذرواژه نمیتواند کمتر از 8 کاراکتر باشد. !!!')

        ]
    }
}

module.exports = new registerValidator();