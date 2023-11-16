import {
    LOGIN_USER,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT_USER,
    LOGOUT_USER_SUCCESS,
    GET_USER_DATA,
  GET_USER_DATA_SUCCESS,
  GET_USER_DATA_FAILURE,

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

  export const getUserData = () => {
    return {
      type: GET_USER_DATA,
    };
  };
  
  export const getUserDataSuccess = (data) => {
    return {
      type: GET_USER_DATA_SUCCESS,
      payload: data,
    };
  };
  
  export const getUserDataFailure = (error) => {
    return {
      type: GET_USER_DATA_FAILURE,
      payload: error,
    };
  };
  
  