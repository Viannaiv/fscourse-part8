import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      id
      bookCount
    }
  }
`
export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author {
        born
        bookCount
        id
        name
      }
      id
      genres
    }
  }
`
export const ALL_GENRE_BOOKS = gql`
  query allBooks($genre: String!) {
    allBooks(genre: $genre) {
      title
      published
      author {
        born
        bookCount
        id
        name
      }
      id
      genres
    }
  }
`

export const USER_INFO = gql`
  query {
    me {
      favoriteGenre
      id
      username
    }
  }
`

export const ADD_BOOK = gql`
  mutation addBook(
    $title: String!, 
    $published: Int!, 
    $author: String!, 
    $genres: [String!]!
  ) {
    addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres
    ) {
      title
      published
      author {
        born
        bookCount
        id
        name
      }
      id
      genres
    }
  }
`
export const EDIT_AUTHOR = gql`
  mutation editAuthor(
    $name: String!, 
    $setBornTo: Int!
  ) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
    ) {
      name
      born
      id
      bookCount
    }
  }
`
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`