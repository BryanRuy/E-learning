import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  LOGIN_ERROR,
  GET_USER_DATA,
  GET_USER_DATA_SUCCESS,
  GET_USER_DATA_FAILURE,
} from "./actionTypes";

const initialState = {
  error: "",
  success: false,
  user: {},
  loading: false,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
        error: "",
        success: false,
      };
      break;

    case LOGIN_SUCCESS:
      state = {
        ...state,
        success: true,
        user: action.payload,
        loading: false,
      };
      break;
    case LOGIN_ERROR:
      state = {
        ...state,
        error: action.payload,
        success: false,
        loading: false,
        user: {},
      };
      break;

    case LOGOUT_USER:
      state = { ...state };
      break;
    case LOGOUT_USER_SUCCESS:
      state = { ...state };
      break;

    case GET_USER_DATA:
      state = { ...state };
      break;
    case GET_USER_DATA_SUCCESS:
      state = { ...state };
      break;
    case GET_USER_DATA_FAILURE:
      state = { ...state };
      break;

    default:
      state = { ...state };
      break;
  }
  return state;
};

export default login;
