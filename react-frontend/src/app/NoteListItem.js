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
        <span>{this.props.note.title}</span>
        <span>{this.props.note.modified}</span>
        <span>{this.props.note.content.substr(0, 20)}</span>
      </div>
    )
  }
}
