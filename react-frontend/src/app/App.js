import React from "react"
import { render } from "react-dom"

import style from "../style/App.scss"

import k from "../model/Constants.js"
import DataSource from "../model/DataSourceMock.js"

import AuthenticationController from "./AuthenticationController.js"

/*
 * Main Component of the App
 *
 * Responsible for communicating with the server
 * */
export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.onAuthenticationUpdate = this.onAuthenticationUpdate.bind(this)

    this.state = {
      datasource: new DataSource(this.onAuthenticationUpdate)
    }
  }

  componentDidMount() {
    this.state.datasource.checkAuthenticated((response) => {
      console.log(response)
    })
  }

  onAuthenticationUpdate(datasource) {

    // An update in the datasource just triggers a re-render
    this.forceUpdate()
  }

  render() {
    console.log(this.state.datasource.state.authenticated)
    if (this.state.datasource.state.authenticated == k.NotAuthenticated) {
      return (
        <AuthenticationController
          datasource={this.state.datasource}
          onUpdate={this.onAuthenticationUpdate}
        ></AuthenticationController>
      )
    } else {
      return (
        <div>
          You are authenticated! Good Job!
        </div>
      )
    }
  }
}
