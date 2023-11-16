import {
  SIGN_IN_WITH_GOOGLE,
  SIGN_IN_WITH_GOOGLE_SUCCESS,
  SIGN_IN_WITH_GOOGLE_FAILURE,

} from "./actionTypes"

export const signInWithGoogle = ({ data, history }) => {
  return {
    type: SIGN_IN_WITH_GOOGLE,
    payload: { data, history },
  }
}

export const signInWithGoogleSuccess = (data) => {
  return {
    type: SIGN_IN_WITH_GOOGLE_SUCCESS,
    payload: data,
  }
}

export const signInWithGoogleFailure = (error) => {
  return {
    type: SIGN_IN_WITH_GOOGLE_FAILURE,
    payload: error,
  }
}