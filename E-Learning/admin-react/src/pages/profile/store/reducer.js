

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

import { setLoggedInUser } from '../../../helpers/backend-helpers'

const initialState = {
  user: {},
  updateProfileLoading: false,
  updateProfileError: null,
  updateProfilePictureLoading: false,
  updateProfilePictureError: null,
  updatePasswordLoading: false,
  updatePasswordError: null,


  countiesData: [],
  countiesLoading: false,
  countiesError: false
}



const profileSaga = (state = initialState, action) => {
  switch (action.type) {

    case SET_PROFILE_USER:
      return { ...state, user: action.payload }

    case UPLOAD_PROFILE_PICTURE:
      return { ...state, updateProfilePictureLoading: true }

    case UPLOAD_PROFILE_PICTURE_SUCCESS:
      setLoggedInUser(action.payload)
      return {
        ...state,
        user: action.payload,
        updateProfilePictureLoading: false,
        updateProfilePictureError: null
      }

    case UPLOAD_PROFILE_PICTURE_FAILURE:
      return {
        ...state,
        updateProfilePictureLoading: false,
        updateProfilePictureError: action.payload
      }

    case UPDATE_PROFILE_DATA:
      return { ...state, updateProfileLoading: true }

    case UPDATE_PROFILE_DATA_SUCCESS:
      setLoggedInUser(action.payload)
      return {
        ...state,
        user: action.payload,
        updateProfileLoading: false,
        updateProfileError: null
      }

    case UPDATE_PROFILE_DATA_FAILURE:
      return {
        ...state,
        updateProfileLoading: false,
        updateProfileError: action.payload
      }

    case UPDATE_PASSWORD:
      return { ...state, updatePasswordLoading: true }

    case UPDATE_PASSWORD_SUCCESS:
      setLoggedInUser(action.payload)
      return {
        ...state,
        user: action.payload,
        updatePasswordLoading: false,
        updatePasswordError: null
      }

    case UPDATE_PASSWORD_FAILURE:
      return { ...state, updatePasswordLoading: false, updatePasswordError: action.payload }

    case GET_COUNTIES:
      return { ...state, countiesLoading: true }

    case GET_COUNTIES_SUCCESS:
      return {
        ...state,
        countiesData: action.payload,
        countiesLoading: false,
      }

    case GET_COUNTIES_FAILURE:
      return { ...state, countiesLoading: false, countiesError: action.payload }
    default:
      return state
  }
}

export default profileSaga
