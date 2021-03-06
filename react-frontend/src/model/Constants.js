// Constants for backend API comms
export let NotAuthenticated = 0x00
export let Authenticated    = 0x01
export let BackendURL       = "http://localhost:3000"

// AuthenticationController screen ids
export let LoginScreen      = 0x00
export let RegisterScreen   = 0x01

// Application stuff
export let DataChangeDebounce = 1000
export let MaxTitleLength = 30

// Default export containing all constants
export default {
  NotAuthenticated,
  Authenticated,
  BackendURL,
  LoginScreen,
  RegisterScreen,
  DataChangeDebounce,
  MaxTitleLength
}
