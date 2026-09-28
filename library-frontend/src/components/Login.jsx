import { useState } from 'react'
import { useMutation, useApolloClient } from '@apollo/client/react'
import { LOGIN, ME } from '../queries'

const Login = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [valError, setValError] = useState(null)
  const client = useApolloClient()

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value

      setToken(token)
      localStorage.setItem('bookapp-user-token', token)
      client.refetchQueries({ include: [ME] })
    },
    onError: (error) => {
      setValError(`Login failed: ${error.message}`)
    },
  })

  const handleSubmit = async (evt) => {
    evt.preventDefault()

    const nUsername = username.trim()
    const nPassword = password.trim()

    if (!nUsername || !nPassword) {
      return
    }

    setValError(null)

    await login({
      variables: {
        username: nUsername,
        password: nPassword,
      },
    })

    setUsername('')
    setPassword('')
    setPage('authors')
  }

  if (!show) {
    return
  }

  return (
    <form onSubmit={handleSubmit}>
      {valError && <p>{valError}</p>}
      <div className="">
        <label htmlFor="username">username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(evt) => setUsername(evt.target.value)}
          required
        />
      </div>
      <div className="">
        <label htmlFor="password">password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(evt) => setPassword(evt.target.value)}
          required
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default Login
