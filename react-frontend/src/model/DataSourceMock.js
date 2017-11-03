import k from "./Constants.js"

import Note from "./Note.js"
import User from "./User.js"

class MockServer {
  constructor() {
    this.users = [
      {
        username: "leonard",
        password: "pw1"
      }
    ]

    this.session = {
      username: "leonard"
    }

    this.notes = [
      {
        id: 0,
        title: "Good Morning!",
        date_created: "01:01:2017",
        date_modified: "02:01:2017",
        content: "What's up my friend",
        owner: "leonard"
      },
      {
        id: 1,
        title: "Good Evening!",
        date_created: "01:01:2017",
        date_modified: "02:01:2017",
        content: "Sleep Well",
        owner: "leonard"
      }
    ]
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
      this.session = { username }
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

    this.users.push({ username, password })

    this.session = { username }

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
      notes: this.notes.filter((note) => note.owner = this.session.username)
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
          return new Note(note.id, note.title, note.date_created, note.date_modified, note.content)
        })
      })
    })
  }
}
