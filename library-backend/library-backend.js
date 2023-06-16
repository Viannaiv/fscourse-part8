const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, { author, genre }) => {
      if (author) {
        const selectedAuthor = await Author.findOne({ name: author })

        return genre 
          ? Book.find({ author: selectedAuthor.id, genres: genre }).populate('author')
          : Book.find({ author: selectedAuthor.id }).populate('author')
      } else if (genre) {
        return Book.find({ genres: genre }).populate('author')
      }

      return Book.find({}).populate('author')
    },
    allAuthors: async () => Author.find({})
  },
  Author: {
    bookCount: async (root) => {
      const authorsBooks = await Book.find({ author: root.id }) 
      return authorsBooks.length
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        const newAuthor = new Author ({ name: args.author })
        author = await newAuthor.save()
      }

      const book = new Book ({ ...args, author: author.id })
      const savedBook = await book.save()
      savedBook.author = author
      return savedBook
    },
    editAuthor: async (root, { name, setBornTo }) => {
      const author = await Author.findOne({ name: name })
      author.born = setBornTo
      return author.save()
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})