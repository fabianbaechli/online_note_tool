import k from "./Constants.js"

const users = [
  {
    username: "leonard",
    password: "pw1"
  }
]

let session = undefined

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
    setTimeout(() => {
      if (session) {
        this.state.authenticated = k.Authenticated
        this.state.username = session.username
        callback({
          authenticated: true,
          username: session.username
        })
        console.log("boyo")
        this.onUpdate()
      } else {
        this.state.authenticated = k.NotAuthenticated
        this.state.username = undefined
        callback({
          authenticated: false,
          username: undefined
        })
        this.onUpdate()
      }
    }, 600)
  }

  login(username, password, callback) {
    setTimeout(() => {
      let found_user

      users.map((user) => {
        if (user.username == username) {
          found_user = user
        }
      })

      if (!found_user) {
        return callback({
          ok: false,
          message: "User doesn't exist"
        })
      }

      if (found_user.password == password) {
        session = {
          username: found_user.username
        }

        this.state.authenticated = k.Authenticated
        this.state.username = found_user.username

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
    }, 600)
  }

  register(username, password, retype_password, callback) {
    setTimeout(() => {

      if (password != retype_password) {
        return callback({
          ok: false,
          message: "Passwords don't match"
        })
      }

      let found_user

      users.map((user) => {
        if (user.username == username) {
          found_user = user
        }
      })

      if (found_user) {
        return callback({
          ok: false,
          message: "Username already taken"
        })
      }

      users.push({
        username, password
      })

      callback({
        ok: true,
        message: "Registered as user"
      })
    }, 600)
  }

  logout(callback) {
    setTimeout(() => {
      session = undefined
      callback({
        ok: true
      })
    }, 600)
  }
}
