import k from "./Constants.js"

import Note from "./Note.js"
import User from "./User.js"

import { getDateString } from "./Utils.js"

class MockServer {
  constructor() {
    if (localStorage.getItem("notetool_exists") === null) {
      localStorage.setItem("users", JSON.stringify([]))
      localStorage.setItem("noteid", JSON.stringify(0))
      localStorage.setItem("userid", JSON.stringify(0))
      localStorage.setItem("session", JSON.stringify(null))
      localStorage.setItem("notes", JSON.stringify([]))
      localStorage.setItem("notetool_exists", JSON.stringify("created!"))
    }
  }

  authenticated(callback) {
    const session = JSON.parse(localStorage.getItem("session"))

    if (session) {
      callback({
        authenticated: true,
        username: session.username
      })
    } else {
      callback({
        authenticated: false,
        username: null
      })
    }
  }

  login(username, password, callback) {
    const users = JSON.parse(localStorage.getItem("users"))

    let user_found

    users.map((user) => {
      if (user.username == username) user_found = user
    })

    if (!user_found) {
      return callback({
        ok: false,
        message: "User doesn't exist"
      })
    }

    if (user_found.password == password) {

      localStorage.setItem("session", JSON.stringify({
        id: user_found.id,
        username: username
      }))

      return callback({
        ok: true,
        message: "Logged in"
      })
    } else {
      return callback({
        ok: false,
        message: "Invalid password"
      })
    }
  }

  register(username, password, password_repeat, callback) {
    if (password != password_repeat) {
      return callback({
        ok: false,
        message: "Passwords don't match"
      })
    }

    const users = JSON.parse(localStorage.getItem("users"))

    let user_found

    users.map((user) => {
      if (user.username == username) user_found = user
    })

    if (user_found) {
      return callback({
        ok: false,
        message: "Username already taken"
      })
    }

    const userid = JSON.parse(localStorage.getItem("userid"))
    localStorage.setItem("userid", JSON.stringify(userid + 1))

    localStorage.setItem("users", JSON.stringify(users.concat({
      id: userid,
      username: username,
      password: password
    })))

    localStorage.setItem("session", JSON.stringify({
      id: userid,
      username: username
    }))

    callback({
      ok: true,
      message: "Created user"
    })
  }

  logout(callback) {
    localStorage.setItem("session", null)

    callback({
      ok: true
    })
  }

  fetchNoteList(callback) {
    const session = JSON.parse(localStorage.getItem("session"))

    if (this.session === null) {
      return callback({
        ok: false,
        message: "Not logged in"
      })
    }

    const notes = JSON.parse(localStorage.getItem("notes"))

    callback({
      ok: true,
      notes: notes.filter((note) => {
        return note.users.filter((user) => {
          return user.username == session.username
        }).length > 0
      })
    })
  }

  createNote(callback) {
    const session = JSON.parse(localStorage.getItem("session"))

    if (session === null) {
      return callback({
        ok: false,
        message: "Not logged in"
      })
    }

    const notes = JSON.parse(localStorage.getItem("notes"))
    const noteid = JSON.parse(localStorage.getItem("noteid"))
    localStorage.setItem("noteid", noteid + 1)

    notes.push({
      id: noteid,
      title: "Untitled",
      date_created: getDateString(),
      date_modified: getDateString(),
      content: "No content yet",
      users: [{ id: session.id, username: session.username }]
    })

    localStorage.setItem("notes", JSON.stringify(notes))

    callback({
      ok: true,
      message: "Note created"
    })
  }

  changeNote(id, title, content, callback) {
    const session = JSON.parse(localStorage.getItem("session"))

    if (session === null) {
      return callback({
        ok: false,
        message: "Not logged in"
      })
    }

    const notes = JSON.parse(localStorage.getItem("notes"))

    let found_note

    notes.map((note) => {
      if (note.id == id) found_note = note
    })

    if (!found_note) {
      return callback({
        ok: false,
        message: "Note doesn't exists"
      })
    }

    found_note.title = title
    found_note.content = content
    found_note.date_modified = getDateString()

    localStorage.setItem("notes", JSON.stringify(notes))

    callback({
      ok: true,
      message: "Note changed"
    })
  }

  deleteNote(id, callback) {
    const session = JSON.parse(localStorage.getItem("session"))

    if (session === null) {
      return callback({
        ok: false,
        message: "Not logged in"
      })
    }

    let notes = JSON.parse(localStorage.getItem("notes"))

    let found_note

    notes.map((note) => {
      if (note.id == id) found_note = note
    })

    if (!found_note) {
      return callback({
        ok: false,
        message: "Note doesn't exists"
      })
    }

    notes = notes.filter((note) => {
      return note.id != id
    })

    localStorage.setItem("notes", JSON.stringify(notes))

    callback({
      ok: true,
      message: "Note deleted"
    })
  }

  invite(id, username, callback) {
    const session = JSON.parse(localStorage.getItem("session"))

    if (session === null) {
      return callback({
        ok: false,
        message: "Not logged in"
      })
    }

    const notes = JSON.parse(localStorage.getItem("notes"))

    // Check if the note exists
    let found_note

    notes.map((note) => {
      if (note.id == id) found_note = note
    })

    if (!found_note) {
      return callback({
        ok: false,
        message: "Note doesn't exist"
      })
    }

    const users = JSON.parse(localStorage.getItem("users"))

    // Check if user exists
    let found_user

    users.map((user) => {
      if (user.username == username) found_user = user
    })

    if (!found_user) {
      return callback({
        ok: false,
        message: "Invited username doesn't exist"
      })
    }

    found_note.users.push({
      id: found_user.id,
      username: found_user.username
    })

    localStorage.setItem("notes", JSON.stringify(notes))

    callback({
      ok: true,
      message: "User invited"
    })
  }

  uninvite(id, username, callback) {
    const session = JSON.parse(localStorage.getItem("session"))

    if (session === null) {
      return callback({
        ok: false,
        message: "Not logged in"
      })
    }

    let notes = JSON.parse(localStorage.getItem("notes"))

    // Check if the note exists
    let found_note

    notes.map((note) => {
      if (note.id == id) found_note = note
    })

    if (!found_note) {
      return callback({
        ok: false,
        message: "Note doesn't exist"
      })
    }

    const users = JSON.parse(localStorage.getItem("users"))

    // Check if user exists
    let found_user

    users.map((user) => {
      if (user.username == username) found_user = user
    })

    if (!found_user) {
      return callback({
        ok: false,
        message: "Uninvited username doesn't exist"
      })
    }

    found_note.users = found_note.users.filter((user) => {
      return user.username != username
    })

    if (found_note.users.length == 0) {
      notes = notes.filter((note) => {
        return note.id != found_note.id
      })
    }

    localStorage.setItem("notes", JSON.stringify(notes))

    callback({
      ok: true,
      message: "User was uninvited"
    })
  }
}

const server = new MockServer()

/*
 * Offline mock of the backend used for development without the server
 * */
export default class DataSource {
  constructor(onUpdate) {
    this.state = {
      authenticated: k.NotAuthenticated,
      username: null
    }
    this.onUpdate = onUpdate
  }

  checkAuthenticated(callback) {
    server.authenticated((response) => {
      this.state.authenticated = response.authenticated ? k.Authenticated : k.NotAuthenticated
      this.state.username = response.username
      callback(response)
      if (this.onUpdate) this.onUpdate()
    })
  }

  login(username, password, callback) {
    server.login(username, password, (response) => {
      if (response.ok) {
        this.state.authenticated = k.Authenticated
        this.state.username = username
        callback(response)
      } else {
        this.state.authenticated = k.NotAuthenticated
        this.state.username = null
        callback(response)
      }
      this.checkAuthenticated(() => { /* do nothing */ })
    })
  }

  register(username, password, retype_password, callback) {
    server.register(username, password, retype_password, (response) => {
      if (response.ok) {
        this.state.authenticated = k.Authenticated
        this.state.username = username
      } else {
        this.state.authenticated = k.NotAuthenticated
        this.state.username = null
      }

      callback(response)
      this.checkAuthenticated(() => { /* do nothing */ })
    })
  }

  logout(callback) {
    server.logout((response) => {
      callback(response)
      this.checkAuthenticated(() => { /* do nothing */ })
    })
  }

  fetchNoteList(callback) {
    server.fetchNoteList((response) => {
      if (response.ok == false) {
        return callback(response)
      }

      callback({
        ok: true,
        notes: response.notes.map((note) => {
          return new Note(
            note.id,
            note.title,
            note.date_created,
            note.date_modified,
            note.content,
            note.users.map((user) => new User(user.id, user.username))
          )
        })
      })
    })
  }

  createNote(callback) {
    server.createNote(callback)
  }

  changeNote(id, title, content, callback) {
    server.changeNote(id, title, content, callback)
  }

  deleteNote(id, callback) {
    server.deleteNote(id, callback)
  }

  invite(id, username, callback) {
    server.invite(id, username, callback)
  }

  uninvite(id, username, callback) {
    server.uninvite(id, username, callback)
  }
}
