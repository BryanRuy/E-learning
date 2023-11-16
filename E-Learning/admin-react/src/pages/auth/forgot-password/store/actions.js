import {
  FORGOT_ACCOUNT_PASSWORD,
  FORGOT_ACCOUNT_PASSWORD_SUCCESS,
  FORGOT_ACCOUNT_PASSWORD_FAILURE,

} from "./actionTypes"

export const forgotAccountPassword = (data) => {
  return {
    type: FORGOT_ACCOUNT_PASSWORD,
    payload: data,
  }
}

export const forgotAccountPasswordSuccess = (data) => {
  return {
    type: FORGOT_ACCOUNT_PASSWORD_SUCCESS,
    payload: data,
  }
}

export const forgotAccountPasswordFailure = (error) => {
  return {
    type: FORGOT_ACCOUNT_PASSWORD_FAILURE,
    payload: error,
  }
}