import {
  UPLOAD_PROFILE_PICTURE,
  UPLOAD_PROFILE_PICTURE_SUCCESS,
  UPLOAD_PROFILE_PICTURE_FAILURE,
  UPDATE_PROFILE_DATA,
  UPDATE_PROFILE_DATA_SUCCESS,
  UPDATE_PROFILE_DATA_FAILURE,
  UPDATE_PASSWORD,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAILURE,
  SET_PROFILE_USER,

  GET_COUNTIES,
  GET_COUNTIES_SUCCESS,
  GET_COUNTIES_FAILURE,

  
} from './actionTypes'


export const uploadProfilePicture = (data) => {
  return {
    type: UPLOAD_PROFILE_PICTURE,
    payload: data
  }
}

export const uploadProfilePictureSuccess = (data) => {
  return {
    type: UPLOAD_PROFILE_PICTURE_SUCCESS,
    payload: data
  }
}

export const uploadProfilePictureFailure = (error) => {
  return {
    type: UPLOAD_PROFILE_PICTURE_FAILURE,
    payload: error
  }
}

export const updateProfileData = (data) => {
  return {
    type: UPDATE_PROFILE_DATA,
    payload: data
  }
}

export const updateProfileDataSuccess = (data) => {
  return {
    type: UPDATE_PROFILE_DATA_SUCCESS,
    payload: data
  }
}

export const updateProfileDataFailure = (error) => {
  return {
    type: UPDATE_PROFILE_DATA_FAILURE,
    payload: error
  }
}

export const updatePassword = (data) => {
  return {
    type: UPDATE_PASSWORD,
    payload: data
  }
}

export const updatePasswordSuccess = (data) => {
  return {
    type: UPDATE_PASSWORD_SUCCESS,
    payload: data
  }
}

export const updatePasswordFailure = (error) => {
  return {
    type: UPDATE_PASSWORD_FAILURE,
    payload: error
  }
}

export const setProfileUser = (data) => {
  return {
    type: SET_PROFILE_USER,
    payload: data
  }
}

export const getCounties = () => {
  return {
    type: GET_COUNTIES
  }
}

export const getCountiesSuccess = (data) => {
  return {
    type: GET_COUNTIES_SUCCESS,
    payload: data
  }
}

export const getCountiesFailure = (error) => {
  return {
    type: GET_COUNTIES_FAILURE,
    payload: error
  }
}

