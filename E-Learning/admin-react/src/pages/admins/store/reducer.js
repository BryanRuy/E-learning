import {
  GET_ADMINS,
  GET_ADMINS_SUCCESS,
  GET_ADMINS_FAILURE,
  GET_ADMIN_DETAIL,
  GET_ADMIN_DETAIL_SUCCESS,
  GET_ADMIN_DETAIL_FAILURE,
  REGISTER_ADMIN,
REGISTER_ADMIN_SUCCESS,
REGISTER_ADMIN_FAILURE,
} from "./actionsTypes";

const initialState = {
  adminsList: {},
  admins: [],
  adminsLoading: false,
  adminsError: null,

  adminDetail: {},
  adminDetailLoading: false,
  adminDetailError: null,

  registerAdminSuccess:false,
  registerAdminLoading:false,
  registerAdminError:null
};

const adminsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ADMINS:
      return { ...state, adminsLoading: true };

    case GET_ADMINS_SUCCESS:
      return {
        ...state,
        adminsList: {
          ...state.adminsList,
          [action.payload.page]: action.payload.res.data,
        },
        adminsLoading: false,
        admins: action.payload.res,
      };

    case GET_ADMINS_FAILURE:
      return {
        ...state,
        adminsLoading: false,
        adminsError: action.payload,
      };

    case GET_ADMIN_DETAIL:
      return { ...state, adminDetailLoading: true };

    case GET_ADMIN_DETAIL_SUCCESS:
      return {
        ...state,
        adminDetailLoading: false,
        adminDetail: action.payload.res,
      };

    case GET_ADMIN_DETAIL_FAILURE:
      return {
        ...state,
        adminDetailLoading: false,
        adminDetailError: action.payload.res,
      };
      case REGISTER_ADMIN:
        return {
          ...state,
          registerAdminLoading:true
        }
      case REGISTER_ADMIN_SUCCESS:
        return {
          ...state,
          registerAdminLoading:false,
          registerAdminSuccess:true
        }
      case REGISTER_ADMIN_FAILURE:
        return {
          ...state,
          registerAdminLoading:false,
          registerAdminError:action.payload
        }

    default:
      return state;
  }
};

export default adminsReducer;
