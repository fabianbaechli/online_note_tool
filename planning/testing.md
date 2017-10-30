# Testing
## User Stories
As a user I want to:

| user story                                                     | Pass |
|----------------------------------------------------------------|------|
| Create a user account                                          |  :x: |
| Login to my user account                                       |  :x: |
| Not have to reenter my credentials, everytime I visit the page |  :x: |
| Create a note                                                  |  :x: |
| View all my notes                                              |  :x: |
| Search for notes                                               |  :x: |
| Change a note                                                  |  :x: |
| Delete a note                                                  |  :x: |
| Preview a Markdown note in GitHub style                        |  :x: |
| Logout                                                         |  :x: |

## Technical requirements

| Technical requrement                                           | Pass |
|----------------------------------------------------------------|------|
| Clientside validation for creating user page                   |  :x: |
| Serverside validation for creating user page                   |  :x: |
| Escaping clientside strings                                    |  :x: |
| Writing user credentials to Database(passoword hashed)         |  :x: |
| Websocket connection to server for automatic storing of changes|  :x: |
| Storing the sesssion via "express-session"                     |  :x: |
| Clientside validation for create note page                     |  :x: |
| Serverside validation for create note page                     |  :x: |
| Writing note to db on websocket 'send' to `create_entry`       |  :x: |
| Changing entry on websocket 'send' to `/change_entry`          |  :x: |
| Deleting entry on websocket 'send' to `/delete_enty`           |  :x: |
