import k from "./Constants.js"

import Note from "./Note.js"
import User from "./User.js"

import { getDateString } from "./Utils.js"

class MockServer {
  constructor() {
    this.users = [
      {
        id: 0,
        username: "leonard",
        password: "pw1"
      },
      {
        id: 1,
        username: "peter",
        password: "pw2"
      }
    ]

    this.noteid = 0
    this.userid = 1

    this.session = {
      id: 0,
      username: "leonard"
    }

    this.notes = []
  }

  authenticated(callback) {
    callback({
      authenticated: this.session !== undefined,
      username: (this.session ? this.session.username : undefined)
    })
  }

  login(username, password, callback) {
    let user_found

    this.users.map((user) => {
      if (user.username == username) user_found = user
    })

    if (!user_found) {
      return callback({
        ok: false,
        message: "User doesn't exist"
      })
    }

    if (user_found.password == password) {
      this.session = { id: user_found.id, username }
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

    let user_found

    this.users.map((user) => {
      if (user.username == username) user_found = user
    })

    if (user_found) {
      return callback({
        ok: false,
        message: "Username already taken"
      })
    }

    const userid = this.userid++

    this.users.push({ userid, username, password })

    this.session = { id: userid, username }

    callback({
      ok: true,
      message: "Created user"
    })
  }

  logout(callback) {
    this.session = undefined
    callback({
      ok: true
    })
  }

  fetchNoteList(callback) {
    if (this.session === undefined) {
      return callback({
        ok: false,
        message: "Not logged in"
      })
    }

    callback({
      ok: true,
      notes: this.notes.filter((note) => {
        return note.users.filter((user) => {
          return user.username = this.session.username
        }).length > 0
      })
    })
  }

  createNote(callback) {
    if (this.session === undefined) {
      return callback({
        ok: false,
        message: "Not logged in"
      })
    }

    this.notes.push({
      id: this.noteid++,
      title: "Untitled",
      date_created: getDateString(),
      date_modified: getDateString(),
      content: "No content yet",
      users: [{ id: this.session.id, username: this.session.username }]
    })

    callback({
      ok: true,
      message: "Note created"
    })
  }

  changeNote(id, title, content, callback) {
    if (this.session === undefined) {
      return callback({
        ok: false,
        message: "Not logged in"
      })
    }

    let found_note

    this.notes.map((note) => {
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

    callback({
      ok: true,
      message: "Note changed"
    })
  }

  deleteNote(id, callback) {
    if (this.session === undefined) {
      return callback({
        ok: false,
        message: "Not logged in"
      })
    }

    let found_note

    this.notes.map((note) => {
      if (note.id == id) found_note = note
    })

    if (!found_note) {
      return callback({
        ok: false,
        message: "Note doesn't exists"
      })
    }

    // Check if the session user is a contributor of this note
    let found_user

    found_note.users.map((user) => {
      if (user.username == this.session.username) found_user = user
    })

    if (!found_user) {
      return callback({
        ok: false,
        message: "Not a contributor of this note"
      })
    }

    this.notes = this.notes.filter((note) => {
      return note.id != id
    })

    callback({
      ok: true,
      message: "Note deleted"
    })
  }

  invite(id, username, callback) {
    if (this.session === undefined) {
      return callback({
        ok: false,
        message: "Not logged in"
      })
    }

    // Check if the note exists
    let found_note

    this.notes.map((note) => {
      if (note.id == id) found_note = note
    })

    if (!found_note) {
      return callback({
        ok: false,
        message: "Note doesn't exist"
      })
    }

    // Check if user exists
    let found_user

    this.users.map((user) => {
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

    callback({
      ok: true,
      message: "User invited"
    })
  }

  uninvite(id, username, callback) {
    if (this.session === undefined) {
      return callback({
        ok: false,
        message: "Not logged in"
      })
    }

    // Check if the note exists
    let found_note

    this.notes.map((note) => {
      if (note.id == id) found_note = note
    })

    if (!found_note) {
      return callback({
        ok: false,
        message: "Note doesn't exist"
      })
    }

    // Check if user exists
    let found_user

    this.users.map((user) => {
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
      this.notes = this.notes.filter((note) => {
        return note.id != found_note.id
      })
    }

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
      username: undefined
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
        this.state.username = undefined
        callback(response)
      }
      if (this.onUpdate) this.onUpdate()
    })
  }

  register(username, password, retype_password, callback) {
    server.register(username, password, retype_password, (response) => {
      if (response.ok) {
        this.state.authenticated = k.Authenticated
        this.state.username = username
      } else {
        this.state.authenticated = k.NotAuthenticated
        this.state.username = undefined
      }

      callback(response)
      if (this.onUpdate) this.onUpdate()
    })
  }

  logout(callback) {
    server.logout((response) => {
      callback(response)
      if (this.onUpdate) this.onUpdate()
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
