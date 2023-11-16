import {
  GET_UPCOMING_TESTS,
  GET_UPCOMING_TESTS_SUCCESS,
  GET_UPCOMING_TESTS_FAILURE,
  GET_PAST_TESTS,
  GET_PAST_TESTS_SUCCESS,
  GET_PAST_TESTS_FAILURE,
  NEW_TEST_ATTEMPT,
  NEW_TEST_ATTEMPT_SUCCESS,
  NEW_TEST_ATTEMPT_FAILURE,
  SUBMIT_TEST_ATTEMPT,
  SUBMIT_TEST_ATTEMPT_SUCCESS,
  SUBMIT_TEST_ATTEMPT_FAILURE,
  UPDATE_OBJECTIVE_QUESTION,
  UPDATE_SUBJECTIVE_QUESTION,
  NEXT_QUESTION,
  PREVIOUS_QUESTION,
  SELECT_QUESTION,
  GET_TEST_ATTEMPT_DETAILS,
  GET_TEST_ATTEMPT_DETAILS_SUCCESS,
  GET_TEST_ATTEMPT_DETAILS_FAILURE,

} from './actionTypes'


export const getUpcomingTests = (data) => {
  return {
    type: GET_UPCOMING_TESTS,
    payload:{data}
  }
}

export const getUpcomingTestsSuccess = (data) => {
  return {
    type: GET_UPCOMING_TESTS_SUCCESS,
    payload: data
  }
}

export const getUpcomingTestsFailure = (error) => {
  return {
    type: GET_UPCOMING_TESTS_FAILURE,
    payload: error
  }
}

export const getPastTests = (data) => {
  return {
    type: GET_PAST_TESTS,
    payload:data
  }
}

export const getPastTestsSuccess = (data) => {
  return {
    type: GET_PAST_TESTS_SUCCESS,
    payload: data
  }
}

export const getPastTestsFailure = (error) => {
  return {
    type: GET_PAST_TESTS_FAILURE,
    payload: error
  }
}

export const newTestAttempt = ({ id, data }) => {
  return {
    type: NEW_TEST_ATTEMPT,
    payload: { id, data }
  }
}

export const newTestAttemptSuccess = ({ id, data }) => {
  return {
    type: NEW_TEST_ATTEMPT_SUCCESS,
    payload: { id, data }
  }
}

export const newTestAttemptFailure = ({ id, error }) => {
  return {
    type: NEW_TEST_ATTEMPT_FAILURE,
    payload: { id, error }
  }
}

export const submitTestAttempt = (data) => {
  return {
    type: SUBMIT_TEST_ATTEMPT,
    payload: data
  }
}

export const submitTestAttemptSuccess = (data) => {
  return {
    type: SUBMIT_TEST_ATTEMPT_SUCCESS,
    payload: data
  }
}

export const submitTestAttemptFailure = ({ error, isSubmitted }) => {
  return {
    type: SUBMIT_TEST_ATTEMPT_FAILURE,
    payload: { error, isSubmitted }
  }
}

export const updateObjectiveQuestion = ({ id }) => {
  return {
    type: UPDATE_OBJECTIVE_QUESTION,
    payload: { id }
  }
}

export const updateSubjectiveQuestion = ({ value }) => {
  return {
    type: UPDATE_SUBJECTIVE_QUESTION,
    payload: value
  }
}

export const nextQuestion = () => {
  return {
    type: NEXT_QUESTION,
  }
}

export const previousQuestion = () => {
  return {
    type: PREVIOUS_QUESTION,
  }
}

export const selectQuestion = ({ index }) => {
  return {
    type: SELECT_QUESTION,
    payload: { index }
  }
}

export const getTestAttemptDetails = (id) => {
  return {
    type: GET_TEST_ATTEMPT_DETAILS,
    payload: id
  }
}

export const getTestAttemptDetailsSuccess = (data) => {
  return {
    type: GET_TEST_ATTEMPT_DETAILS_SUCCESS,
    payload: data
  }
}

export const getTestAttemptDetailsFailure = (error) => {
  return {
    type: GET_TEST_ATTEMPT_DETAILS_FAILURE,
    payload: error
  }
}