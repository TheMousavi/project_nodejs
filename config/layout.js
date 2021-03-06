const path = require('path');
const expressLayouts = require('express-ejs-layouts');

module.exports = {
    PUBLIC_DIR : 'public',
    VIEW_ENGINE : 'ejs',
    VIEW_DIR : path.resolve('./resource/views'),
    EJS : {
        expressLayouts,
        master : 'master',
        extractStyles : true,
        extractScripts : true
    }
}