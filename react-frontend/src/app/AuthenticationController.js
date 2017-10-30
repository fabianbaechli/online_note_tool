import React from "react"
import { render } from "react-dom"

import k from "../model/Constants.js"

/*
 * Authentication Controller
 *
 * Manages the login and register screens
 * */
export default class AuthenticationController extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeScreen: k.LoginScreen,
      message: undefined
    }

    this.switchScreen = this.switchScreen.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  switchScreen() {
    this.setState({
      activeScreen: (this.state.activeScreen == k.LoginScreen) ? k.RegisterScreen : k.LoginScreen,
      message: undefined
    })
  }

  handleSubmit(event) {
    event.preventDefault()

    const username = event.target[0].value
    const password = event.target[1].value
    const confirmpassword = event.target[2].value

    if (this.state.activeScreen == k.LoginScreen) {
      this.props.datasource.login(username, password, (response) => {
        if (response.ok) {
          this.props.onUpdate()
        } else {
          this.setState({
            message: response.message
          })
        }
      })
    } else {

      // Check if both password fields contain the same password
      if (password != confirmpassword) {
        this.setState({
          message: "Passwords don't match up"
        })
      } else {
        this.setState({
          message: undefined
        })

        this.props.datasource.register(username, password, confirmpassword, (response) => {
          if (response.ok) {
            this.props.onUpdate()
          } else {
            this.setState({
              message: response.message
            })
          }
        })
      }
    }
  }

  render() {
    const registerScreen = this.state.activeScreen == k.RegisterScreen

    return (
      <div className="AuthenticationController">
        <p id="messageField">{this.state.message}</p>
        <form onSubmit={this.handleSubmit}>
            <input type="text" name="username" placeholder="Username"></input>
            <input type="password" name="password" placeholder="Password"></input>
            {registerScreen ? <input type="password" name="password" placeholder="Confirm Password"></input> : null }
            <button type="submit">Send</button>
        </form>
        <button id="switchScreenButton" onClick={this.switchScreen}>
          {this.state.activeScreen == k.LoginScreen ? "Register as new User" : "Login as existing User"}
        </button>
      </div>
    )
  }
}
