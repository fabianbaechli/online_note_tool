import React from "react"

import style from "../style/NoteTitleBar.scss"

export default class NoteTitleBar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="NoteTitleBar">
        <p className="title">{this.props.note.title}</p>
        <p className="created">{this.props.note.created}</p>
        <p className="modified">{this.props.note.modified}</p>
      </div>
    )
  }
}
