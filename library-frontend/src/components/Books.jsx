import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = ({ show }) => {
  const [selectedGenres, setSelectedGenres] = useState([])
  const result = useQuery(ALL_BOOKS)

  if (!show || !result.data) {
    return null
  }

  const { allBooks } = result.data
  const allGenres = allBooks.reduce((genres, book) => {
    for (const genre of book.genres) {
      genres.add(genre)
    }
    return genres
  }, new Set())
  const sortedGenres = [...allGenres].toSorted()
  const filteredBooks = selectedGenres.length
    ? allBooks.filter((book) => {
        for (const genre of book.genres) {
          if (selectedGenres.includes(genre)) {
            return true
          }
        }
        return false
      })
    : allBooks

  const handleGenreClick = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((currGenre) => currGenre !== genre))
    } else {
      setSelectedGenres([...selectedGenres, genre])
    }
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
        </div>
      )}

      {selectedGenres.length > 0 && (
        <p>
          By genre: <strong>{selectedGenres.join(', ')}</strong>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
