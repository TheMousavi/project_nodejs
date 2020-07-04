const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const methodOverride = require('method-override');
const Helper = require('./helper');
const rememberLogin = require('app/http/middleware/rememberLogin');
const chatController = require('app/http/controllers/chat/chatController');
const access = require('app/accessUser');
const socketIo = require('socket.io');
const HttpGraphQl = require('express-graphql');
const schemaGQ = require('app/graphql/schema');
const resolverGQ = require('app/graphql/resolver');



const app = express();


module.exports =  class Application {
    constructor(){
        this.configServer();
        this.configDatabase();
        this.setConfig();
        this.setRoutes();
    }

    configServer(){
        const server = http.createServer(app);
        const io = socketIo(server);
        chatController.connectToSocket(io);
        server.listen(3000,()=>console.log(`listening on port 3000 .....`));

    }
    configDatabase(){
        mongoose.Promise = global.Promise;
        mongoose.connect(config.database.url , {useFindAndModify : false ,  useNewUrlParser: true  , useUnifiedTopology: true } );
    }

    setConfig(){
        require('app/passport/passport-local');
        require('app/passport/passport-google');
        require('app/passport/passport-jwt');
        app.use(express.static(config.layout.PUBLIC_DIR));
        app.set('view engine' , config.layout.VIEW_ENGINE);
        app.set('views' ,config.layout.VIEW_DIR);
        app.use(config.layout.EJS.expressLayouts);
        app.set('layout',config.layout.EJS.master);
        app.set('layout extractScripts',config.layout.EJS.extractScripts);
        app.set('layout extractStyles',config.layout.EJS.extractStyles);
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended : true }));
        app.use(session({
            ...config.session
        }));
        app.use(cookieParser('secretID'));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.use((req, res,next)=>{
            app.locals = new Helper(req, res).object();
            next();
        });

        app.use(methodOverride('_method'));
        app.use(rememberLogin.handle);
        app.use(access.middleware());

    }

    setRoutes(){
        //app.use(require('./routes/web/index'));

        app.use('/graphql', HttpGraphQl({
            schema : schemaGQ,
            rootValue : resolverGQ,
            graphiql : true
        }))



        app.use(require('app/routes/api'));
        app.use(require('app/routes/web'));
    }
}