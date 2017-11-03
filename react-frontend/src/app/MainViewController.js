import React from "react"

import style from "../style/MainViewController.scss"

import k from "../model/Constants.js"

/*
 * Controller for the main application
 * */
export default class MainViewController extends React.Component {
  constructor(props) {
    super(props)

    this.fetchNoteList = this.fetchNoteList.bind(this)

    this.state = {
      notes: []
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

  render() {
    return (
      <div className="MainViewController">{ this.state.notes.map((note) => {
        return (
          <div>
            <p>{note.title}</p>
            <p>{note.created} - {note.modified}</p>
            <p>{note.content}</p>
          </div>
        )
      }) }</div>
    )
  }
}
