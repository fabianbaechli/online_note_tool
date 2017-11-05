import k from "./Constants.js"

// Send a GET request to the backend
export const backend_get = (route, callback) => {
  const xhr = new XMLHttpRequest()
  xhr.open("GET", k.BackendURL + "/" + route, true)
  xhr.addEventListener("load", () => callback(JSON.parse(xhr.responseText, xhr)))
  xhr.send()
}

// Send a POST request to the backend
export const backend_post = (route, payload, callback) => {
  const xhr = new XMLHttpRequest()
  xhr.open("POST", k.BackendURL + "/" + route, true)
  xhr.addEventListener("load", () => callback(JSON.parse(xhr.responseText, xhr)))
  xhr.send(JSON.stringify(payload))
}

// Returns the current date as a string
export const getDateString = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return year + "-" + month + "-" + day
}
