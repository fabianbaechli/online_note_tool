import React from "react"

import style from "../style/NoteContentView.scss"

export default class NoteContentView extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="NoteContentView">
        {this.props.note.content}
      </div>
    )
  }
}
