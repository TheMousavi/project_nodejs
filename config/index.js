const service  = require('./service');
const layout   = require('./layout');
const session  = require('./session');
const database = require('./database');

module.exports = {
    layout,
    database,
    service,
    session,
    debug : true,
    jwt : {
        secretkey : 'asd#SDAS%ASDA!asA'
    }
}