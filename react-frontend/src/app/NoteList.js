import React from "react"

import style from "../style/NoteList.scss"

import NoteListItem from "./NoteListItem.js"

export default class NoteList extends React.Component {
  constructor(props) {
    super(props)

    this.selectionChanged = this.selectionChanged.bind(this)
  }

  selectionChanged(index) {
    this.props.onSelectionChange(index)
  }

  render() {
    return (
      <div className="NoteList">
        <button className="createNoteButton" onClick={this.props.onCreateNote}>Create new Note</button>
        <div className="list">
          {
            this.props.notes.map((note, index) => {
              return (
                <NoteListItem
                  note={note}
                  key={note.id}
                  index={index}
                  onSelect={this.selectionChanged}
                  selected={index == this.props.selected_index}
                />
              )
            })
          }
        </div>
        <button className="logoutButton" onClick={this.props.onLogout}>Logout</button>
      </div>
    )
  }
}
