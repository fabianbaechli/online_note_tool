import React from "react"

import k from "../model/Constants.js"
import DataSource from "../model/DataSourceMock.js"

import AuthenticationController from "./AuthenticationController.js"
import MainViewController from "./MainViewController.js"

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
      // Do nothing here, onAuthenticationUpdate gets called automatically by the datasource
    })
  }

  onAuthenticationUpdate(datasource) {
    this.forceUpdate()
  }

  render() {
    if (this.state.datasource.state.authenticated == k.NotAuthenticated) {
      return (
        <AuthenticationController
          datasource={this.state.datasource}
          onUpdate={this.onAuthenticationUpdate}
        ></AuthenticationController>
      )
    } else {
      return (
        <MainViewController datasource={this.state.datasource}/>
      )
    }
  }
}
