import React from "react"

import style from "../style/MainViewController.scss"

import k from "../model/Constants.js"

import NoteList from "./NoteList.js"
import NoteView from "./NoteView.js"

/*
 * Controller for the main application
 * */
export default class MainViewController extends React.Component {
  constructor(props) {
    super(props)

    this.fetchNoteList = this.fetchNoteList.bind(this)
    this.onSelectionChange = this.onSelectionChange.bind(this)
    this.createNote = this.createNote.bind(this)
    this.deleteNote = this.deleteNote.bind(this)
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onContentChange = this.onContentChange.bind(this)
    this.invite = this.invite.bind(this)
    this.uninvite = this.uninvite.bind(this)

    this.state = {
      notes: [],
      selected_index: 0
    }
  }

  componentDidMount() {
    this.fetchNoteList()
  }

  fetchNoteList() {
    this.props.datasource.fetchNoteList((response) => {
      if (!response.ok) {
        this.setState({
          notes: []
        })
      } else {
        this.setState({
          notes: response.notes
        })
      }
    })
  }

  onSelectionChange(index) {
    this.setState({
      selected_index: index
    })
  }

  createNote() {
    this.props.datasource.createNote((response) => {
      this.fetchNoteList()
    })
  }

  deleteNote() {
    console.log("Deleting note " + this.state.notes[this.state.selected_index].id)
  }

  onTitleChange(event) {
    const title = event.target.value
    const content = this.state.notes[this.state.selected_index].content

    const notes = this.state.notes.slice()
    notes[this.state.selected_index] = Object.assign({}, notes[this.state.selected_index])
    notes[this.state.selected_index].title = title

    this.props.datasource.changeNote(notes[this.state.selected_index].id, title, content, (response) => {
      this.fetchNoteList()
    })
  }

  onContentChange(event) {
    const title = this.state.notes[this.state.selected_index].title
    const content = event.target.value

    const notes = this.state.notes.slice()
    notes[this.state.selected_index] = Object.assign({}, notes[this.state.selected_index])
    notes[this.state.selected_index].content = content

    this.props.datasource.changeNote(notes[this.state.selected_index].id, title, content, (response) => {
      this.fetchNoteList()
    })
  }

  invite(username) {

  }

  uninvite(username) {

  }

  render() {
    return (
      <div className="MainViewController">
        <NoteList
          notes={this.state.notes}
          selected_index={this.state.selected_index}
          onSelectionChange={this.onSelectionChange}
          onCreateNote={this.createNote}
        />
        <NoteView
          onDelete={this.deleteNote}
          onTitleChange={this.onTitleChange}
          onContentChange={this.onContentChange}
          onInvite={this.invite}
          onUninvite={this.uninvite}
          note={this.state.notes[this.state.selected_index]}
        />
      </div>
    )
  }
}
