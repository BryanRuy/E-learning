import {
  REGISTER_USER,
  REGISTER_STUDENT,
  REGISTER_STUDENT_SUCCESSFUL,
  REGISTER_USER_SUCCESSFUL,
  REGISTER_USER_FAILED,
  API_ERROR
} from "./actionTypes"

export const apiError = error => {
  return {
    type: API_ERROR,
    payload: error,
  }
}

export const registerUser = user => {
  return {
    type: REGISTER_USER,
    payload: { user },
  }
}

export const registerUserSuccessful = user => {
  return {
    type: REGISTER_USER_SUCCESSFUL,
    payload: user,
  }
}

export const registerStudent = user => {
  return {
    type: REGISTER_STUDENT,
    payload: { user },
  }
}

export const registerStudentSuccessful = user => {
  return {
    type: REGISTER_STUDENT_SUCCESSFUL,
    payload: user,
  }
}

export const registerUserFailed = user => {
  return {
    type: REGISTER_USER_FAILED,
    payload: user,
  }
}
