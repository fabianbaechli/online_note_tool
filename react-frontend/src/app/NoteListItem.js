import React from "react"

import style from "../style/NoteListItem.scss"

export default class NoteListItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let classname = "NoteListItem"

    if (this.props.selected) classname += " selected"

    return (
      <div className={classname} onClick={() => this.props.onSelect(this.props.index)}>
        <p className="title">
          {this.props.note.title == "" ? "Untitled" : this.props.note.title}
        </p>
        <p className="modified">{this.props.note.modified}</p>
        <p className="content">{this.props.note.content.substr(0, 20) + "..."}</p>
      </div>
    )
  }
}
