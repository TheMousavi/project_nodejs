
module.exports = {
    RECAPTCHA : {
        SITE_KEY : process.env.RECAPTCHA_SITEKEY,
        SECRET_KEY : process.env.RECAPTCHA_SECRETKEY,
        options : {
            hl : 'fa'
        }
    },
    GOOGLE : {
        CLIENT_ID : process.env.GOOGLE_CLIENTKEY,
        CLIENT_SECRET : process.env.GOOGLE_SECRETKEY,
        callback_URL : 'http://localhost:3000/auth/google/callback'
    },

    MAILTRAP : {
        host: process.env.MAILTRAP_host,
        port: process.env.MAILTRAP_port,
        secure: process.env.MAILTRAP_secure, // true for 465, false for other ports
        auth: {
            user: process.env.MAILTRAP_username, // generated ethereal user
            pass: process.env.MAILTRAP_password // generated ethereal password
        }
    }


}