import React from "react"

import style from "../style/NoteUserListItem.scss"

export default class NoteUserListItem extends React.Component {
  constructor(props) {
    super(props)

    this.uninvite = this.uninvite.bind(this)
  }

  uninvite() {
    this.props.onUninvite(this.props.user.username)
  }

  render() {
    return (
      <div className="NoteUserListItem">
        <span>{this.props.user.username}</span>
        <button onClick={this.uninvite}>Uninvite</button>
      </div>
    )
  }
}
