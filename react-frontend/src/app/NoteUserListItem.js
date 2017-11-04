import React from "react"

import style from "../style/NoteUserListItem.scss"

export default class NoteUserListItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="NoteUserListItem">
        <span>{this.props.user.username}</span>
      </div>
    )
  }
}
