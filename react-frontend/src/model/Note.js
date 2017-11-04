export default class Note {
  constructor(id, title, created, modified, content, users) {
    this.id = id
    this.title = title
    this.created = created
    this.modified = modified
    this.content = content
    this.users = users
  }
}
