import React from "react"
import { render } from "react-dom"

import style from "../style/main.scss"

class App extends React.Component {
  render() {
    return (
      <p>Hello World!</p>
    )
  }
}

render(<App/>, document.getElementById("app"))
