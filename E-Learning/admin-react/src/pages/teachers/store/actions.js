import {
  GET_TEACHERS_STATS,
  GET_TEACHERS_STATS_SUCCESS,
  GET_TEACHERS_STATS_FAILURE,

  GET_TEACHER_DETAILS,
  GET_TEACHER_DETAILS_SUCCESS,
  GET_TEACHER_DETAILS_FAILURE,

  GET_ALL_TEACHERS,
  GET_ALL_TEACHERS_SUCCESS,
  GET_ALL_TEACHERS_FAILURE,

  GET_TEACHER_STUDENTS,
  GET_TEACHER_STUDENTS_SUCCESS,
  GET_TEACHER_STUDENTS_FAILURE,

  ON_SEARCH_TEACHER_CHANGE

} from "./actionTypes"

export const getTeachersStats = () => {
  return {
    type: GET_TEACHERS_STATS,
  }
}

export const getTeachersStatsSuccess = (data) => {
  return {
    type: GET_TEACHERS_STATS_SUCCESS,
    payload: data,
  }
}

export const getTeachersStatsFailure = (error) => {
  return {
    type: GET_TEACHERS_STATS_FAILURE,
    payload: error,
  }
}

export const getTeacherDetails = (id) => {
  return {
    type: GET_TEACHER_DETAILS,
    payload: id
  }
}

export const getTeacherDetailsSuccess = (data) => {
  return {
    type: GET_TEACHER_DETAILS_SUCCESS,
    payload: data,
  }
}

export const getTeacherDetailsFailure = (error) => {
  return {
    type: GET_TEACHER_DETAILS_FAILURE,
    payload: error,
  }
}

export const getAllTeachers = (data) => {
  return {
    type: GET_ALL_TEACHERS,
    payload: data
  }
}

export const getAllTeachersSuccess = (data) => {
  return {
    type: GET_ALL_TEACHERS_SUCCESS,
    payload: data
  }
}


export const getAllTeachersFailure = (error) => {
  return {
    type: GET_ALL_TEACHERS_FAILURE,
    payload: error
  }
}

export const getTeacherStudents = (id) => {
  return {
    type: GET_TEACHER_STUDENTS,
    payload: id
  }
}

export const getTeacherStudentsSuccess = (data) => {
  return {
    type: GET_TEACHER_STUDENTS_SUCCESS,
    payload: data,
  }
}

export const getTeacherStudentsFailure = (error) => {
  return {
    type: GET_TEACHER_STUDENTS_FAILURE,
    payload: error,
  }
}

export const onSearchTeacherChange = () => {
  return {
    type: ON_SEARCH_TEACHER_CHANGE
  }
}