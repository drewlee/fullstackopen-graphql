import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { EDIT_AUTHOR } from '../queries'
import './EditAuthor.css'

const EditAuthor = () => {
  const [editAuthor] = useMutation(EDIT_AUTHOR)
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const handleSubmit = async (evt) => {
    evt.preventDefault()

    const result = await editAuthor({ variables: { name, setBornTo: Number(born) } })
    if (!result.data.editAuthor) {
      alert('author not found')
      return
    }

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>set birth year</h2>

      <form onSubmit={handleSubmit} className="author-form">
        <div className="author-form_field">
          <label htmlFor="name">name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={({ target }) => setName(target.value)}
            required
          />
        </div>

        <div className="author-form_field">
          <label htmlFor="born">born</label>
          <input
            id="born"
            type="text"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
            required
          />
        </div>

        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default EditAuthor
