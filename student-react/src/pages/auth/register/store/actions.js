import {
  REGISTER_ACCOUNT,
  REGISTER_ACCOUNT_SUCCESS,
  REGISTER_ACCOUNT_FAILURE,

} from "./actionTypes"

export const registerAccount = ({ data, history }) => {
  return {
    type: REGISTER_ACCOUNT,
    payload: { data, history },
  }
}

export const registerAccountSuccess = (data) => {
  return {
    type: REGISTER_ACCOUNT_SUCCESS,
    payload: data,
  }
}

export const registerAccountFailure = (error) => {
  return {
    type: REGISTER_ACCOUNT_FAILURE,
    payload: error,
  }
}