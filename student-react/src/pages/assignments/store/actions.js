import {
  GET_NEW_ASSIGNMENTS,
  GET_NEW_ASSIGNMENTS_SUCCESS,
  GET_NEW_ASSIGNMENTS_FAILURE,
  
  GET_PAST_ASSIGNMENTS,
  GET_PAST_ASSIGNMENTS_SUCCESS,
  GET_PAST_ASSIGNMENTS_FAILURE,
  SELECT_ASSIGNMENT,
  GET_ASSIGNMENT_ATTEMPT,
  GET_ASSIGNMENT_ATTEMPT_SUCCESS,
  GET_ASSIGNMENT_ATTEMPT_FAILURE,
  GET_ASSIGNMENT,
  GET_ASSIGNMENT_SUCCESS,
  GET_ASSIGNMENT_FAILURE,
  CREATE_ASSIGNMENT_ATTEMPT,
  CREATE_ASSIGNMENT_ATTEMPT_SUCCESS,
  CREATE_ASSIGNMENT_ATTEMPT_FAILURE,
  SAVE_ANSWER,
  SUBMIT_ASSIGNMENT,
  SUBMIT_ASSIGNMENT_SUCCESS,
  SUBMIT_ASSIGNMENT_FAILURE,

} from './actionTypes'


export const getNewAssignments = (data) => {
  return {
    type: GET_NEW_ASSIGNMENTS,
    payload:data
  }
}

export const getNewAssignmentsSuccess = (data) => {
  return {
    type: GET_NEW_ASSIGNMENTS_SUCCESS,
    payload: data
  }
}

export const getNewAssignmentsFailure = (error) => {
  return {
    type: GET_NEW_ASSIGNMENTS_FAILURE,
    payload: error
  }
}

export const getPastAssignments = (data) => {
  return {
    type: GET_PAST_ASSIGNMENTS,
    payload:data
  }
}

export const getPastAssignmentsSuccess = (data) => {
  return {
    type: GET_PAST_ASSIGNMENTS_SUCCESS,
    payload: data
  }
}

export const getPastAssignmentsFailure = (error) => {
  return {
    type: GET_PAST_ASSIGNMENTS_FAILURE,
    payload: error
  }
}

export const selectAssignment = (data) => {
  return {
    type: SELECT_ASSIGNMENT,
    payload: data
  }
}

export const getAssignmentAttempt = (id) => {
  return {
    type: GET_ASSIGNMENT_ATTEMPT,
    payload: id
  }
}

export const getAssignmentAttemptSuccess = (data) => {
  return {
    type: GET_ASSIGNMENT_ATTEMPT_SUCCESS,
    payload: data
  }
}

export const getAssignmentAttemptFailure = (error) => {
  return {
    type: GET_ASSIGNMENT_ATTEMPT_FAILURE,
    payload: error
  }
}

export const getAssignment = (id) => {
  return {
    type: GET_ASSIGNMENT,
    payload: id
  }
}

export const getAssignmentSuccess = (data) => {
  return {
    type: GET_ASSIGNMENT_SUCCESS,
    payload: data
  }
}

export const getAssignmentFailure = (error) => {
  return {
    type: GET_ASSIGNMENT_FAILURE,
    payload: error
  }
}

export const createAssignmentAttempt = (data) => {
  return {
    type: CREATE_ASSIGNMENT_ATTEMPT,
    payload: data
  }
}

export const createAssignmentAttemptSuccess = (data) => {
  return {
    type: CREATE_ASSIGNMENT_ATTEMPT_SUCCESS,
    payload: data
  }
}

export const createAssignmentAttemptFailure = (error) => {
  return {
    type: CREATE_ASSIGNMENT_ATTEMPT_FAILURE,
    payload: error
  }
}

export const saveAnswer = ({ id, answer }) => {
  return {
    type: SAVE_ANSWER,
    payload: { id, answer }
  }
}

export const submitAssignment = ({ id, data }) => {
  return {
    type: SUBMIT_ASSIGNMENT,
    payload: { id, data }
  }
}

export const submitAssignmentSuccess = ({ id, data }) => {
  return {
    type: SUBMIT_ASSIGNMENT_SUCCESS,
    payload: { id, data }
  }
}

export const submitAssignmentFailure = ({ id, error, isSubmitted }) => {
  return {
    type: SUBMIT_ASSIGNMENT_FAILURE,
    payload: { id, error, isSubmitted }
  }
}