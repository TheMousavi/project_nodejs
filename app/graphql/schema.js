const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        id : ID
        name : String
        email : String
        password : String
    }

    type RootQuery {
        users : [User!]!
    }

    schema {
        query : RootQuery
    }  
`);