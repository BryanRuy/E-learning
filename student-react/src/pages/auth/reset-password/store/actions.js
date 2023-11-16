import {
  RESET_ACCOUNT_PASSWORD,
  RESET_ACCOUNT_PASSWORD_SUCCESS,
  RESET_ACCOUNT_PASSWORD_FAILURE,

} from "./actionTypes"

export const resetAccountPassword = (data) => {
  return {
    type: RESET_ACCOUNT_PASSWORD,
    payload: data,
  }
}

export const resetAccountPasswordSuccess = (data) => {
  return {
    type: RESET_ACCOUNT_PASSWORD_SUCCESS,
    payload: data,
  }
}

export const resetAccountPasswordFailure = (error) => {
  return {
    type: RESET_ACCOUNT_PASSWORD_FAILURE,
    payload: error,
  }
}