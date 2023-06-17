import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import EditAuthor from './components/EditAuthor'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'

import { useQuery, useApolloClient, NetworkStatus } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, USER_INFO } from './queries'


const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const [user, setUser] = useState(null)

  const authorResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)
  const userResult = useQuery(USER_INFO, {
    skip: !token,
    notifyOnNetworkStatusChange: true,
    onCompleted: data => setUser(data.me)
  })

  useEffect(() => {
    if ( token && !user) {
      userResult.refetch()
    }
  }, [token]) // eslint-disable-line

  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (
    authorResult.loading 
    || booksResult.loading 
    || userResult.loading
    || userResult.networkStatus === NetworkStatus.refetch
  ) {
    return <div>loading...</div>
  }

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>
  
        <Authors show={page === 'authors'} authors={authorResult.data.allAuthors} /> 
  
        <Books show={page === 'books'} books={booksResult.data.allBooks} />

        <LoginForm show={page === 'login'} setToken={setToken} />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add book')}>add book</button>
        <button onClick={() => setPage('recommendations')}>recommend</button>
        <button onClick={ () => { logout(); setPage('authors')}}>logout</button>
      </div>

      <Authors show={page === 'authors'} authors={authorResult.data.allAuthors} />
      <EditAuthor show={page === 'authors'} authors={authorResult.data.allAuthors} /> 

      <Books show={page === 'books'} books={booksResult.data.allBooks} />

      <NewBook show={page === 'add book'} />

      <Recommendations show={page === 'recommendations'} favoriteGenre={userResult.data.me.favoriteGenre} />
    </div>
  )
}

export default App
