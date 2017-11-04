import k from "./Constants.js"
import { backend_get, backend_post } from "./Utils.js"

import Note from "./Note.js"
import User from "./User.js"

export default class DataSource {
  constructor(onUpdate) {
    this.state = {
      authenticated: k.NotAuthenticated,
      user: undefined
    }
    this.onUpdate = onUpdate
  }

  checkAuthenticated(callback) {
    backend_get("authenticated", (response, xhr) => {
      if (response.authenticated) {
        this.state.authenticated = k.Authenticated
        this.state.username = response.username
      } else {
        this.state.authenticated = k.NotAuthenticated
        this.state.username = undefined
      }

      callback(response)
      if (this.onUpdate) this.onUpdate(this)
    })
  }

  // Attempt to login to the backend
  login(username, password, callback) {
    backend_post("login", { username, password }, (response, xhr) => {
      callback(response)
      if (this.onUpdate) this.onUpdate(this)
    })
  }

  // Attempt to register as a new user in the backend
  register(username, password, retype_password, callback) {
    backend_post("register", {
      username,
      password,
      retype_password
    }, (response, xhr) => {
      callback(response)
      if (this.onUpdate) this.onUpdate(this)
    })
  }

  // Logout from the backend
  logout(callback) {
    backend_get("logout", (response, xhr) => {
      this.state.authenticated = kNotAuthenticated
      this.state.username = undefined
      callback(response)
      if (this.onUpdate) this.onUpdate(this)
    })
  }

  // Fetch the list of notes of the current user from the backend
  fetchNoteList(callback) {
    backend_get("get_notes", (response, xhr) => {
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
}
