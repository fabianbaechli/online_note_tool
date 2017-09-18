# Todos

| Tasks                | Assignee                          |
|----------------------|-----------------------------------|
| Design               | Fabian Bächli & Leonard Schütz    |
| Front-End            | Fabian Bächli & Leonard Schütz    |
| Database Design      | Fabrice Bosshard                  |
| Backend-Programming  | Fabrice Bosshard & Igor Cetkovic  |

# Design

Decide what design paradigm to choose.

- Material Design
- Weird mixture between Leonards website and material design
- Something ugly

# Abstract

- A single huge list?
- Nested lists?
  - Tree-like?
    - Every note has a parent note
  - Fixed-depth?
- What does a note contain?
  - Creation date
  - Last modified
  - List of contributors
    - Four different levels of permissions
      - None
      - Reviewer
      - Contributor
      - Owner
  - Content
    - UTF-8 Text
    - Not encrypted

# Main screen

- List of permission levels and their respective notes
  - If you are the owner of some notes you will have a list of these notes
- List view on the left
  - Similar to the category table view on iOS
  - ![](https://software.intel.com/sites/default/files/porting-ios-win8-advanced-figure3.jpg)
- Content view on the right
- Split based system
  - Write dedicated code to make sure this grid-stuff works flawlessly and without clutter
  - Creating a new split and extracting data from it should be very easy
    - Event-based system

# Permissions

| Level       | Read | Write | Delete | Change permissions | See invited users |
|-------------|------|-------|--------|--------------------|-------------------|
| None        | No   | No    | No     | No                 | No                |
| Reviewer    | Yes  | No    | No     | No                 | No                |
| Contributor | Yes  | Yes   | No     | No                 | Yes               |
| Owner       | Yes  | Yes   | Yes    | Yes                | Yes               |

