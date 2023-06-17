import { useQuery } from '@apollo/client'
import { ALL_GENRE_BOOKS } from '../queries'

const Recommendations = ({ show, favoriteGenre }) => {

  const genreResult = useQuery(ALL_GENRE_BOOKS, {
    variables: { genre: favoriteGenre }
  })

  if (!show) return null
  if (genreResult.loading) return <div>loading...</div>

  return (
    <div>
      <h2>recommendations</h2>

      <span>books in your favorite genre: {favoriteGenre}</span>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {genreResult.data.allBooks.map(book => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
