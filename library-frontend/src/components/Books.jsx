import { useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'
import BooksTable from './BooksTable'

const Books = ({ show }) => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  const booksAll = useQuery(ALL_BOOKS)
  const [getBooksByGenre, booksByGenre] = useLazyQuery(ALL_BOOKS)

  if (!show || !booksAll.data) {
    return null
  }

  const { allBooks } = booksAll.data
  const allGenres = allBooks.reduce((genres, book) => {
    for (const genre of book.genres) {
      genres.add(genre)
    }
    return genres
  }, new Set())
  const sortedGenres = [...allGenres].toSorted()

  let books = allBooks

  if (booksByGenre.data) {
    books = booksByGenre.data.allBooks
  } else if (booksByGenre.previousData) {
    books = booksByGenre.previousData.allBooks
  }

  const handleGenreClick = async (genre) => {
    const options = genre ? { variables: { genre } } : undefined

    await getBooksByGenre(options)
    setSelectedGenre(genre)
  }

  return (
    <div>
      <h2>books</h2>

      {sortedGenres.length > 0 && (
        <div>
          {sortedGenres.map((genre) => (
            <button type="button" key={genre} onClick={() => handleGenreClick(genre)}>
              {genre}
            </button>
          ))}
          <button type="button" onClick={() => handleGenreClick(null)}>
            all
          </button>
        </div>
      )}

      {selectedGenre && (
        <p>
          By genre: <strong>{selectedGenre}</strong>
        </p>
      )}

      <BooksTable books={books} />
    </div>
  )
}

export default Books
