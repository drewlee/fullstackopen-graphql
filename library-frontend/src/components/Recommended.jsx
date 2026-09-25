import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'

const Recommended = ({ show }) => {
  const result = useQuery(ALL_BOOKS)
  const user = useQuery(ME)

  if (!show || !result.data || !user.data) {
    return null
  }

  const { allBooks } = result.data
  const { favoriteGenre } = user.data.me
  const recommendedBooks = allBooks.filter((book) => {
    return book.genres.includes(favoriteGenre)
  })

  return (
    <div>
      <h2>recommendations</h2>

      <p>
        Books in your favorite genre: <strong>{favoriteGenre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((a) => (
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

export default Recommended
