import React from "react"

import style from "../style/NoteTitleBar.scss"

export default class NoteTitleBar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="NoteTitleBar">
        <textarea
          className="title"
          onChange={this.props.onChange}
          value={this.props.note.title}
        />
        <p className="modified">
          Last modified: <span>{this.props.note.modified}</span>
        </p>
        <button className="deleteButton" onClick={this.props.onDelete}>Delete Note</button>
      </div>
    )
  }
}
