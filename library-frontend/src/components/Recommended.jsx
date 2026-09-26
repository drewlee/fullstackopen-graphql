import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'
import BooksTable from './BooksTable'

const Recommended = ({ show }) => {
  const user = useQuery(ME)
  const options = user.data
    ? { variables: { genre: user.data.me.favoriteGenre } }
    : undefined
  const books = useQuery(ALL_BOOKS, options)

  if (!show || !user.data || !books.data) {
    return null
  }

  const genre = user.data.me.favoriteGenre
  const { allBooks } = books.data

  return (
    <div>
      <h2>recommendations</h2>

      <p>
        Books in your favorite genre: <strong>{genre}</strong>
      </p>

      <BooksTable books={allBooks} />
    </div>
  )
}

export default Recommended
