import {
  SETUP_ACCOUNT_PASSWORD,
  SETUP_ACCOUNT_PASSWORD_SUCCESS,
  SETUP_ACCOUNT_PASSWORD_FAILURE,

} from "./actionTypes"

export const setupAccountPassword = ({ data, history }) => {
  return {
    type: SETUP_ACCOUNT_PASSWORD,
    payload: { data, history },
  }
}

export const setupAccountPasswordSuccess = (data) => {
  return {
    type: SETUP_ACCOUNT_PASSWORD_SUCCESS,
    payload: data,
  }
}

export const setupAccountPasswordFailure = (error) => {
  return {
    type: SETUP_ACCOUNT_PASSWORD_FAILURE,
    payload: error,
  }
}