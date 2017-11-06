# Testing
## User Stories
As a user I want to:

| user story                                                     | Pass |
|----------------------------------------------------------------|------|
| Create a user account                                          |  :heavy_check_mark: |
| Login to my user account                                       |  :heavy_check_mark: |
| Not have to reenter my credentials, everytime I visit the page |  :heavy_check_mark: |
| Create a note                                                  |  :heavy_check_mark: |
| View all my notes                                              |  :heavy_check_mark: |
| Search for notes                                               |  :heavy_check_mark: |
| Change a note                                                  |  :heavy_check_mark: |
| Delete a note                                                  |  :heavy_check_mark: |
| Preview a Markdown note in GitHub style                        |  :heavy_check_mark: |
| Logout                                                         |  :heavy_check_mark: |

## Technical requirements

| Technical requrement                                           | Pass |
|----------------------------------------------------------------|------|
| Clientside validation for creating user page                   |  :heavy_check_mark: |
| Serverside validation for creating user page                   |  :heavy_check_mark: |
| Escaping clientside strings                                    |  :heavy_check_mark: |
| Writing user credentials to Database(passoword hashed)         |  :heavy_check_mark: |
| Websocket connection to server for automatic storing of changes|  :heavy_check_mark: |
| Storing the sesssion via "express-session"                     |  :heavy_check_mark: |
| Clientside validation for create note page                     |  :heavy_check_mark: |
| Serverside validation for create note page                     |  :heavy_check_mark: |
| Writing note to db on websocket 'send' to `create_entry`       |  :heavy_check_mark: |
| Changing entry on websocket 'send' to `/change_entry`          |  :heavy_check_mark: |
| Deleting entry on websocket 'send' to `/delete_enty`           |  :heavy_check_mark: |
