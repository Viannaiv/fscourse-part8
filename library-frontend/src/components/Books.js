import { useState } from 'react'
import { useQuery, NetworkStatus } from '@apollo/client'
import { ALL_GENRE_BOOKS } from '../queries'

const Books = ({ show, books}) => {
  const [shownBooks, setShownBooks] = useState(books)
  const [shownGenre, setShownGenre] = useState('all genres')

  const genres = [...new Set(books.map(book => book.genres).flat())]

  const { loading, error, data, refetch, networkStatus } = useQuery(ALL_GENRE_BOOKS, { // eslint-disable-line
    variables: { genre: '' },
    notifyOnNetworkStatusChange: true,
    onCompleted: data => setShownBooks(data.allBooks)
  })

  if (!show) return null
  if (loading || networkStatus === NetworkStatus.refetch) return <div>loading...</div>

  return (
    <div>
      <h2>books</h2>

      <span>in genre: {shownGenre}</span>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {shownBooks.map(book => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => {setShownBooks(books); setShownGenre('all genres') }}>
        all genres
      </button>
      {genres.map(genre => (
        <button 
          key={genre} 
          onClick={() => {
            refetch({ genre: genre });
            setShownGenre(genre) }}
        >{genre}</button>
      ))}
    </div>
  )
}

export default Books
