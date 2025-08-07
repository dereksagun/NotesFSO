import { useState, useEffect, useRef } from 'react'
import noteService from './services/notes'
import Note from './components/Note'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2025</em>
    </div>
  )
}


const Notification = ({message}) => {
  if(message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username , setUsername] = useState('')
  const [password, setPassword] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    console.log('logging in with ', username, password)

    try {
      const user = await loginService.login({ username, password })
      noteService.setToken(user.setToken)
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const noteFormRef = useRef()

  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
    
  }

  const toggleImportance = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}
    console.log(changedNote)

    noteService
      .update(id,changedNote)
      .then(returnedNote => {
        setNotes(notes.map(n => n.id === id ? returnedNote : n))
      })
      .catch(() => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })

  }

  const notesToShow = showAll 
  ? notes 
  : notes.filter(note => note.important)

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const loginForm = () => {

    return (
      <div>
        <Togglable buttonLabel='login'>
          <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
        </Togglable>
        <Togglable buttonLabel='test'>
          <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
        </Togglable>
        
      </div>
    )
  }
  
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {user === null ?
        loginForm() :
        <div>
          <div>
            <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p> 
            {noteForm()}
          </div>
          <div>
            <button onClick={() => setShowAll(!showAll)}>
              show {showAll ? 'important' : 'all'}
            </button>
          </div>
          <ul>
            {notesToShow.map(note => 
              <Note 
                key={note.id} 
                note={note} 
                toggleImportance={() => toggleImportance(note.id)}/>
            )}
          </ul>
      
          <Footer />
        </div>
      
      }
    </div>
  )

  /*<div>
          <p>{user.name} logged-in</p>
          {noteForm()}
      </div>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={() => toggleImportance(note.id)}/>
        )}
      </ul>
      
      <Footer />*/
}

export default App 