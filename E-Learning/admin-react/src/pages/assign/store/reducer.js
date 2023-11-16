import {
   POST_ASSIGN_TEACHER,
   POST_ASSIGN_TEACHER_SUCCESS,
   POST_ASSIGN_TEACHER_FAILURE,

   UNASSIGN_TEACHER,
  UNASSIGN_TEACHER_SUCCESS,
  UNASSIGN_TEACHER_FAILURE,
  
  } from './actionTypes'
  
  
  const initialState = {
    assignTeacher: {},
    assignTeacherSuccess:false,
    assignTeacherError: null,
    assignTeacherLoading: false,
  
    studentHistory: {},
    studentHistoryError: null,
    studentHistoryLoading: false,

    unassignTeacher: {},
    unassignTeacherSuccess:false,
    unassignTeacherError: null,
    unassignTeacherLoading: false,
  
  }
  
  
  const assignReducer = (state = initialState, action) => {
    switch (action.type) {
      case POST_ASSIGN_TEACHER:
        return { ...state, assignTeacherLoading: true  , assignTeacherSuccess:false}
      case POST_ASSIGN_TEACHER_SUCCESS:
        return { ...state, assignTeacherLoading: false, assignTeacherSuccess: true }
      case POST_ASSIGN_TEACHER_FAILURE:
        return { ...state, assignTeacherLoading: false, assignTeacherError: action.payload }

      case UNASSIGN_TEACHER:
        return { ...state, unassignTeacherLoading: true , unassignTeacherSuccess: true }
      case UNASSIGN_TEACHER_SUCCESS:
        return { ...state, unassignTeacherLoading: false, unassignTeacherSuccess: true }
      case UNASSIGN_TEACHER_FAILURE:
        return { ...state, unassignTeacherLoading: false, unassignTeacherError: action.payload }
      
    
      default:
        return state
    }
  }
  
  export default assignReducer