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
      console.log(response)

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

  render() {
    return (
      <div className="MainViewController">
        <NoteList
          notes={this.state.notes}
          selected_index={this.state.selected_index}
          onSelectionChange={this.onSelectionChange}
        />
        <NoteView
          datasource={this.props.datasource}
          note={this.state.notes[this.state.selected_index]}
        />
      </div>
    )
  }
}
