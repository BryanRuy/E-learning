import {
  UPDATE_ADMIN_PROFILE,
  UPDATE_ADMIN_PROFILE_SUCCESS,
  UPDATE_ADMIN_PROFILE_FAILURE,
  UPDATE_TEACHER_PROFILE,
  UPDATE_TEACHER_PROFILE_SUCCESS,
  UPDATE_TEACHER_PROFILE_FAILURE,
  UPDATE_STUDENT_PROFILE,
  UPDATE_STUDENT_PROFILE_SUCCESS,
  UPDATE_STUDENT_PROFILE_FAILURE,
  UPDATE_ADMIN_PROFILE_PICTURE,
  UPDATE_ADMIN_PROFILE_PICTURE_SUCCESS,
  UPDATE_ADMIN_PROFILE_PICTURE_FAILURE,
  UPDATE_TEACHER_PROFILE_PICTURE,
  UPDATE_TEACHER_PROFILE_PICTURE_SUCCESS,
  UPDATE_TEACHER_PROFILE_PICTURE_FAILURE,
  UPDATE_STUDENT_PROFILE_PICTURE,
  UPDATE_STUDENT_PROFILE_PICTURE_SUCCESS,
  UPDATE_STUDENT_PROFILE_PICTURE_FAILURE,
  UPDATE_USER_PASSWORD,
  UPDATE_USER_PASSWORD_SUCCESS,
  UPDATE_USER_PASSWORD_FAILURE,
} from "./actionsTypes";

const initialState = {
  admin: null,
  tecaher: null,
  student: null,

  adminProfileLoading: false,
  adminProfileSuccess: false,
  adminProfileError: null,

  teacherProfileLoading: false,
  teacherProfileSuccess: false,
  teacherProfileError: null,

  studentProfileLoading: false,
  studentProfileSuccess: false,
  studentProfileError: null,

  adminProfilePictureLoading: false,
  adminProfilePictureSuccess: false,
  adminProfilePictureError: null,

  teacherProfilePictureLoading: false,
  teacherProfilePictureSuccess: false,
  teacherProfilePictureError: null,

  studentProfilePictureLoading: false,
  studentProfilePictureSuccess: false,
  studentProfilePictureError: null,

  userPasswordLoading: false,
  userPasswordSuccess: false,
  userPasswordError: null,
};

const userProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ADMIN_PROFILE:
      return { ...state, adminProfileLoading: true };
    case UPDATE_ADMIN_PROFILE_SUCCESS:
      return {
        ...state,
        adminProfileLoading: false,
        adminProfileSuccess: true,
        admin: action.payload,
      };
    case UPDATE_ADMIN_PROFILE_FAILURE:
      return {
        ...state,
        adminProfileLoading: false,
        adminProfileError: action.payload,
      };

    case UPDATE_TEACHER_PROFILE:
      return { ...state, teacherProfileLoading: true };
    case UPDATE_TEACHER_PROFILE_SUCCESS:
      return {
        ...state,
        teacherProfileLoading: false,
        teacherProfileSuccess: true,
        teacher: action.payload,
      };
    case UPDATE_TEACHER_PROFILE_FAILURE:
      return {
        ...state,
        teacherProfileLoading: false,
        teacherProfileError: action.payload,
      };

    case UPDATE_STUDENT_PROFILE:
      return { ...state, studentProfileLoading: true };
    case UPDATE_STUDENT_PROFILE_SUCCESS:
      return {
        ...state,
        studentProfileLoading: false,
        studentProfileSuccess: true,
        student: action.payload,
      };
    case UPDATE_STUDENT_PROFILE_FAILURE:
      return {
        ...state,
        studentProfileLoading: false,
        studentProfileError: action.payload,
      };

    case UPDATE_ADMIN_PROFILE_PICTURE:
      return { ...state, adminProfilePictureLoading: true };
    case UPDATE_ADMIN_PROFILE_PICTURE_SUCCESS:
      return {
        ...state,
        adminProfilePictureLoading: false,
        adminProfilePictureSuccess: true,
        admin: action.payload,
      };
    case UPDATE_ADMIN_PROFILE_PICTURE_FAILURE:
      return {
        ...state,
        adminProfilePictureLoading: false,
        adminProfilePictureError: action.payload,
      };

    case UPDATE_TEACHER_PROFILE_PICTURE:
      return { ...state, teacherProfilePictureLoading: true };
    case UPDATE_TEACHER_PROFILE_PICTURE_SUCCESS:
      return {
        ...state,
        teacherProfilePictureLoading: false,
        teacherProfilePictureSuccess: true,
        teacher: action.payload,
      };
    case UPDATE_TEACHER_PROFILE_PICTURE_FAILURE:
      return {
        ...state,
        teacherProfilePictureLoading: false,
        teacherProfilePictureError: action.payload,
      };

    case UPDATE_STUDENT_PROFILE_PICTURE:
      return { ...state, studentProfilePictureLoading: true };
    case UPDATE_STUDENT_PROFILE_PICTURE_SUCCESS:
      return {
        ...state,
        studentProfilePictureLoading: false,
        studentProfilePictureSuccess: true,
        student: action.payload,
      };
    case UPDATE_STUDENT_PROFILE_PICTURE_FAILURE:
      return {
        ...state,
        studentProfilePictureLoading: false,
        studentProfilePictureError: action.payload,
      };
    case UPDATE_USER_PASSWORD:
      return {
        ...state,
        userPasswordLoading: true,
      };
    case UPDATE_USER_PASSWORD_SUCCESS:
      return {
        ...state,
        userPasswordLoading: false,
        userPasswordSuccess: true,
      };
    case UPDATE_USER_PASSWORD_FAILURE:
      return {
        ...state,
        userPasswordLoading: false,
        userPasswordError: action.payload,
        userPasswordSuccess: false
      };

    default:
      return state;
  }
};

export default userProfileReducer;
