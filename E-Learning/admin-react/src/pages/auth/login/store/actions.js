import {
    LOGIN_USER,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT_USER,
    LOGOUT_USER_SUCCESS,

  } from "./actionTypes"
  
  export const loginUser = (user, history) => {
    return {
      type: LOGIN_USER,
      payload: { user, history },
    }
  }
  
  export const loginSuccess = user => {
    return {
      type: LOGIN_SUCCESS,
      payload: user,
    }
  }
  
export const logoutUser = history => {
    return {
      type: LOGOUT_USER,
      payload: { history },
    }
  }
  
  export const logoutUserSuccess = () => {
    return {
      type: LOGOUT_USER_SUCCESS,
      payload: {},
    }
  }
  
  export const loginError = error => {
    return {
      type: LOGIN_ERROR,
      payload: error,
    }
  }

  