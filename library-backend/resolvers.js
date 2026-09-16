import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'
import Book from './models/book.js'
import Author from './models/author.js'
import User from './models/user.js'

const resolvers = {
  Author: {
    bookCount: async ({ _id }) =>
      Book.find({ author: _id.toString() }).countDocuments(),
  },

  Query: {
    bookCount: async () => Book.collection.countDocuments(),

    authorCount: async () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      const query = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        query.author = author._id.toString()
      }

      if (args.genre) {
        query.genres = args.genre
      }

      const books = await Book.find(query)
      await Book.populate(books, { path: 'author' })

      return books
    },

    allAuthors: async () => Author.find({}),

    me: async (root, args, { currentUser }) => currentUser,
  },

  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }

      const titleExists = await Book.exists({ title: args.title })

      if (titleExists) {
        throw new GraphQLError(`Book title must be unique: ${args.title}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({
          name: args.author,
        })

        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError(`Saving author failed: ${error.message}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error,
            },
          })
        }
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: author._id,
      })

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError(`Saving book failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error,
          },
        })
      }

      book.author = author
      return book
    },

    editAuthor: async (root, { name, setBornTo }, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }

      const author = await Author.findOne({ name })
      if (!author) {
        return null
      }

      author.born = setBornTo

      try {
        author.save()
      } catch (error) {
        throw new GraphQLError(`Saving author failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: name,
            error,
          },
        })
      }

      return author
    },

    createUser: async (root, { username, favoriteGenre }) => {
      const user = new User({ username, favoriteGenre })

      try {
        await user.save()
      } catch (error) {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: username,
            error,
          },
        })
      }

      return user
    },

    login: async (root, { username, password }) => {
      const user = await User.findOne({ username })

      if (!user || password !== 'secret') {
        throw new GraphQLError('Invalid credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
}

export { resolvers }
