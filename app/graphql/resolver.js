const User = require('app/models/users');
const passport = require('passport');
const jwt = require('jsonwebtoken');

module.exports = {
    users : async function() {
        const users = await User.find({});
        return users;
    }
}