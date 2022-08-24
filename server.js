const express = require('express')//import express
const { graphqlHTTP } = require("express-graphql");//import graphQL
const app = express()//execute express


//This is just to allow dummy data
//by imorting from our graphQL library
const {
GraphQLSchema,
GraphQLObjectType,
GraphQLString,
GraphQLList,
GraphQLInt,
GraphQLNonNull
} = require('graphql')

const authors = [
    {id: 1, name: 'J.K. Rowling'},
    {id: 2, name: 'J.R.R. Tolkien'},
    {id: 3, name: 'Brent Weeks'}
]


const books = [
    {id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1},
    {id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1},
    {id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1},
    {id: 4, name: 'The Fellowship pf the Ring', authorId: 2},
    {id: 5, name: 'The Two Towers', authorId: 2},
    {id: 6, name: 'Return of the King', authorId: 2},
    {id: 7, nme: 'The Way of Shadows', authorId: 3},
    {id: 8, nme: 'Beyonf the Shadows', authorId: 3}
    
]


const AuthorType = new GraphQLObjectType({
    name : 'Author',
    description : 'This represents an author of a book',
    fields: ()=>({
        id: {type:GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        books: {
            type: new GraphQLList(BookType),
            resolve: (author)=>{
                return books.filter(book => book.authorId === author.id)
            }
        },

    })
})




const BookType = new GraphQLObjectType({
    name : 'Book',
    description : 'This represents a book written by an author',
    fields: ()=>({
        id: {type:GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve: (book)=>{
                return authors.find(author=> author.id === book.authorId)
            }
        }
    })
})





//This is our graphQL schema
// const schema = new GraphQLSchema({
//     query : new GraphQLObjectType({
//         name: "HelloWorld",
//         fields: ()=>({
//             message: {
//                 type: GraphQLString,
//                 resolve: ()=> 'Hello World'
//             }
//         })
//     })
// })


const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: ()=>({
        books: {
            type: new GraphQLList(BookType),
            description: 'List of All Books',
            resolve: ()=> books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of All Authors',
            resolve: ()=> authors
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType
})


//will give us a user interface to access our graphql server without postman
app.use('/graphql', graphqlHTTP ({
    schema: schema,
    graphiql: true
}))

app.listen(5000, ()=>{
    console.log("Our server is running!!!!")
})