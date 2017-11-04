import React from "react"

import style from "../style/NoteView.scss"

import NoteTitleBar from "./NoteTitleBar.js"
import NoteContentView from "./NoteContentView.js"
import NoteUserList from "./NoteUserList.js"

export default class NoteView extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.note === undefined) {
      return (
        <div className="NoteView">
          <span className="NoNoteSelected">No Note selected!</span>
        </div>
      )
    }

    return (
      <div className="NoteView">
        <NoteTitleBar note={this.props.note} onDelete={this.props.onDelete} onChange={this.props.onTitleChange}/>
        <NoteContentView note={this.props.note} onChange={this.props.onContentChange}/>
        <NoteUserList note={this.props.note} onInvite={this.props.onInvite} onUninvite={this.props.onUninvite}/>
      </div>
    )
  }
}
