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
      this.checkAuthenticated(() => { /* do nothing */ })
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
      this.checkAuthenticated(() => { /* do nothing */ })
    })
  }

  // Logout from the backend
  logout(callback) {
    backend_get("logout", (response, xhr) => {
      this.state.authenticated = kNotAuthenticated
      this.state.username = undefined
      callback(response)
      this.checkAuthenticated(() => { /* do nothing */ })
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

  createNote(callback) {
    backend_post("create_note", {}, (response, xhr) => {
      callback(response)
    })
  }

  changeNote(id, title, content, callback) {
    backend_post("change_note", {
      note_id: id,
      title,
      content
    }, (response, xhr) => {
      callback(response)
    })
  }

  deleteNote(id, callback) {
    backend_post("delete_note", {
      note_id: id
    }, (response, xhr) => {
      callback(response)
    })
  }

  invite(id, username, callback) {
    backend_post("invite", {
      note_id: id,
      username
    }, (response) => {
      callback(response)
    })
  }

  uninvite(id, username, callback) {
    backend_post("uninvite_user", {
      note_id: id,
      username
    }, (response) => {
      callback(response)
    })
  }
}
