import React from "react"
import Markdown from "react-remarkable"

import style from "../style/NoteContentView.scss"

const MarkdownConfig = {
  imagesAreblocks: true
}

export default class NoteContentView extends React.Component {
  constructor(props) {
    super(props)

    this.toggleView = this.toggleView.bind(this)
    this.getRenderedView = this.getRenderedView.bind(this)

    this.state = {
      show_markdown: false
    }
  }

  toggleView() {
    this.setState({
      show_markdown: !this.state.show_markdown
    })
  }

  getRenderedView() {
    if (this.state.show_markdown) {
      return (
        <Markdown className="NoteContentViewMarkdown" container="div" options={MarkdownConfig}>
          {this.props.note.content}
        </Markdown>
      )
    } else {
      return (
        <textarea
          className="content"
          onChange={this.props.onChange}
          value={this.props.note.content}
        />
      )
    }
  }

  render() {
    return (
      <div className="NoteContentView">
        <button onClick={this.toggleView}>Toggle View</button>
        {
          this.getRenderedView()
        }
      </div>
    )
  }
}
