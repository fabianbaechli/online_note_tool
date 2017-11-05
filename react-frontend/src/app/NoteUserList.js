import React from "react"

import User from "../model/User.js"

import NoteUserListItem from "./NoteUserListItem.js"

import style from "../style/NoteUserList.scss"

export default class NoteUserList extends React.Component {
  constructor(props) {
    super(props)

    this.onFieldChange = this.onFieldChange.bind(this)
    this.invite = this.invite.bind(this)

    this.state = {
      invite_field: ""
    }
  }

  onFieldChange(event) {
    this.setState({
      invite_field: event.target.value
    })
  }

  invite() {
    if (this.state.invite_field == "") return
    this.props.onInvite(this.state.invite_field)
    this.setState({
      invite_field: ""
    })
  }

  render() {
    return (
      <div className="NoteUserList">
        <div className="userlist">
        {
          this.props.note.users.map((user) => {
            return (
              <NoteUserListItem
                user={user}
                key={user.id}
                onUninvite={this.props.onUninvite}
              />
            )
          })
        }
        </div>
        <div className="invite_dialog">
          <input
            placeholder="Enter username"
            onChange={this.onFieldChange}
            value={this.state.invite_field}
          ></input>
          <button onClick={this.invite}>Invite</button>
        </div>
      </div>
    )
  }
}
