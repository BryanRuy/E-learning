import {
  GET_STUDENTS_STATS,
  GET_STUDENTS_STATS_SUCCESS,
  GET_STUDENTS_STATS_FAILURE,

  GET_STUDENT_DETAILS,
  GET_STUDENT_DETAILS_SUCCESS,
  GET_STUDENT_DETAILS_FAILURE,

  GET_ALL_STUDENTS,
  GET_ALL_STUDENTS_SUCCESS,
  GET_ALL_STUDENTS_FAILURE,

  GET_STUDENT_NEW_OR_WAITING_STATUS,
  GET_STUDENT_NEW_OR_WAITING_STATUS_SUCCESS,
  GET_STUDENT_NEW_OR_WAITING_STATUS_FAILURE,

  GET_ACTIVE_STUDENTS,
  GET_ACTIVE_STUDENTS_SUCCESS,
  GET_ACTIVE_STUDENTS_FAILURE,

  ON_SEARCH_CHANGE

} from "./actionTypes"

export const getStudentsStats = () => {
  return {
    type: GET_STUDENTS_STATS,
  }
}

export const getStudentsStatsSuccess = (data) => {
  return {
    type: GET_STUDENTS_STATS_SUCCESS,
    payload: data,
  }
}

export const getStudentsStatsFailure = (error) => {
  return {
    type: GET_STUDENTS_STATS_FAILURE,
    payload: error,
  }
}

export const getStudentDetails = (id) => {
  return {
    type: GET_STUDENT_DETAILS,
    payload: id
  }
}

export const getStudentDetailsSuccess = (data) => {
  return {
    type: GET_STUDENT_DETAILS_SUCCESS,
    payload: data,
  }
}

export const getStudentDetailsFailure = (error) => {
  return {
    type: GET_STUDENT_DETAILS_FAILURE,
    payload: error,
  }
}

export const getAllStudents = (data) => {
  return {
    type: GET_ALL_STUDENTS,
    payload: data
  }
}

export const getAllStudentsSuccess = (data) => {
  return {
    type: GET_ALL_STUDENTS_SUCCESS,
    payload: data
  }
}

export const getAllStudentsFailure = (error) => {
  return {
    type: GET_ALL_STUDENTS_FAILURE,
    payload: error
  }
}


export const getStudentNewOrWaitingStatus = (data) => {
  return {
    type: GET_STUDENT_NEW_OR_WAITING_STATUS,
    payload: data
  }
}

export const getStudentNewOrWaitingStatusSuccess = (data) => {
  return {
    type: GET_STUDENT_NEW_OR_WAITING_STATUS_SUCCESS,
    payload: data
  }
}

export const getStudentNewOrWaitingStatusFailure = (error) => {
  return {
    type: GET_STUDENT_NEW_OR_WAITING_STATUS_FAILURE,
    payload: error
  }
}

export const onSearchChange = () => {
  return {
    type: ON_SEARCH_CHANGE
  }
}

export const getActiveStudents = (data) => {
  return {
    type: GET_ACTIVE_STUDENTS,
    payload: data
  }
}

export const getActiveStudentsSuccess = (data) => {
  return {
    type: GET_ACTIVE_STUDENTS_SUCCESS,
    payload: data
  }
}

export const getActiveStudentsFailure = (error) => {
  return {
    type: GET_ACTIVE_STUDENTS_FAILURE,
    payload: error
  }
}