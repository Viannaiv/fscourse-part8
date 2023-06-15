import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR } from '../queries'

const EditAuthor = ({ authors }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR)

  const submit = async (event) => {
    event.preventDefault()

    editAuthor({ variables: { name, setBornTo: Number(born) } })
    console.log('edit author')

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <select onChange={({ target }) => setName(target.value)}>
            {authors.map(author => <option value={author.name} key={author.name}>{author.name}</option>)}
          </select>
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default EditAuthor