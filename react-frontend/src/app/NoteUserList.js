import React from "react"

import User from "../model/User.js"

import NoteUserListItem from "./NoteUserListItem.js"

import style from "../style/NoteUserList.scss"

export default class NoteUserList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="NoteUserList">
      {
        this.props.note.users.map((user) => {
          return (
            <NoteUserListItem user={user} key={user.id}/>
          )
        })
      }
      </div>
    )
  }
}
