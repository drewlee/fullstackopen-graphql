import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ALL_BOOKS, ALL_AUTHORS, CREATE_BOOK } from '../queries'
import './NewBook.css'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [ALL_BOOKS, ALL_AUTHORS],
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    if (!genres.length) {
      alert('Please include at least one genre')
      return
    }

    createBook({ variables: { title, author, published: Number(published), genres } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit} className="book-form">
        <div className="book-form_field">
          <label htmlFor="title">title</label>
          <input
            id="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            required
          />
        </div>

        <div className="book-form_field">
          <label htmlFor="author">author</label>
          <input
            id="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            required
          />
        </div>

        <div className="book-form_field">
          <label htmlFor="published">published</label>
          <input
            id="published"
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
            required
          />
        </div>

        <div className="book-form_field">
          <input
            aria-label="genre"
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />

          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>

        <div>genres: {genres.join(' ')}</div>

        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
