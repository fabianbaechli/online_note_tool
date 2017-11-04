import React from "react"

import style from "../style/NoteTitleBar.scss"

export default class NoteTitleBar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="NoteTitleBar">
        <span>{this.props.note.title}</span>
        <span>{this.props.note.created}</span>
        <span>{this.props.note.modified}</span>
      </div>
    )
  }
}
