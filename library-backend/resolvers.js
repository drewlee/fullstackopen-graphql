import { v1 as uuid } from 'uuid'

let authors = [
  {
    name: 'Robert Martin',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky', // birth year not known
    id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
  },
  {
    name: 'Sandi Metz', // birth year not known
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
  },
]

/*
 * It might make more sense to associate a book with its author by storing the author's
 * id in the context of the book instead of the author's name. However, for simplicity,
 * we will store the author's name in connection with the book.
 */

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'crime'],
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'revolution'],
  },
]

const resolvers = {
  Author: {
    bookCount: ({ name }) => books.filter((book) => book.author === name).length,
  },
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      let fBooks = books

      if (args.author) {
        fBooks = fBooks.filter((book) => book.author === args.author)
      }

      if (args.genre) {
        fBooks = fBooks.filter((book) => book.genres.includes(args.genre))
      }

      return fBooks
    },
    allAuthors: () => authors,
  },
  Mutation: {
    addBook: (root, args) => {
      const newBook = {
        title: args.title,
        published: args.published,
        author: args.author,
        id: uuid(),
        genres: args.genres,
      }

      books = [...books, newBook]

      if (!authors.some((author) => author.name === args.author)) {
        const newAuthor = {
          name: args.author,
          id: uuid(),
        }

        authors = [...authors, newAuthor]
      }

      return newBook
    },
    editAuthor: (root, args) => {
      let foundAuthor = authors.find((author) => author.name === args.name)
      if (!foundAuthor) {
        return null
      }

      foundAuthor = { ...foundAuthor, born: args.setBornTo }

      authors = authors.map((author) => {
        if (author.name === foundAuthor.name) {
          return foundAuthor
        }
        return author
      })

      return foundAuthor
    },
  },
}

export { resolvers }
