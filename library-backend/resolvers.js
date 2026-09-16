import Book from './models/book.js'
import Author from './models/author.js'

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
  },

  Mutation: {
    addBook: async (root, args) => {
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

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo

      try {
        author.save()
      } catch (error) {
        throw new GraphQLError(`Saving author failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }

      return author
    },
  },
}

export { resolvers }
