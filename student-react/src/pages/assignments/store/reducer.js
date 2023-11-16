



import {
  GET_NEW_ASSIGNMENTS,
  GET_NEW_ASSIGNMENTS_SUCCESS,
  GET_NEW_ASSIGNMENTS_FAILURE,
  GET_PAST_ASSIGNMENTS,
  GET_PAST_ASSIGNMENTS_SUCCESS,
  GET_PAST_ASSIGNMENTS_FAILURE,
  SELECT_ASSIGNMENT,
  GET_ASSIGNMENT_ATTEMPT,
  GET_ASSIGNMENT_ATTEMPT_FAILURE,
  GET_ASSIGNMENT_ATTEMPT_SUCCESS,
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

const ASSIGNMENT_ANSWERS_KEY = "ASSIGNMENT_ANSWERS_KEY"

const initialState = {
  newAssignmentList: {},
  newAssignments: [],
  newAssignmentsLoading: false,
  newAssignmentsError: null,

  pastAssignmentsList: {},
  pastAssignments: [],
  pastAssignmentsLoading: false,
  pastAssignmentsError: null,

  selectedAssignment: {},
  attempt: {},
  attemptLoading: false,
  attemptError: null,
  createAttemptLoading: false,
  createAttemptError: null,
  assignment: {},
  assignmentLoading: false,
  assignmentError: null,
  assignmentsAnswers: JSON.parse(localStorage.getItem(ASSIGNMENT_ANSWERS_KEY) || "{}"),
  assignmentSubmitLoading: false,
  assignmentSubmitError: null,
}

const updateAnswers = (state) => {
  localStorage.setItem(ASSIGNMENT_ANSWERS_KEY, JSON.stringify(state.assignmentsAnswers));

}

const saveAnswer = (state, { id, answer }) => {
  if (!id) return state
  state.assignmentsAnswers[id] = answer
  updateAnswers(state)
  return {
    ...state,
    assignmentsAnswers: { ...state.assignmentsAnswers }
  }
}

const submitAssignmentSuccess = (state, { id, data }) => {
  delete state.assignmentsAnswers[id]
  updateAnswers(state)
  state.assignment = {}
  state.attempt = {}
  state.selectedAssignment = {}
  return {
    ...state,
    assignmentSubmitLoading: false,
    assignmentSubmitError: null,
    assignmentsAnswers: { ...state.assignmentsAnswers }
  }
}

const submitAssignmentFailure = (state, { id, error, isSubmitted }) => {
  if (isSubmitted) {
    delete state.assignmentsAnswers[id]
    updateAnswers(state)
    state.assignment = {}
    state.attempt = {}
    state.selectedAssignment = {}
  }

  return {
    ...state,
    assignmentSubmitLoading: false,
    assignmentSubmitError: error,
    assignmentsAnswers: { ...state.assignmentsAnswers }
  }
}



const assignmentReducer = (state = initialState, action) => {
  switch (action.type) {

    case GET_NEW_ASSIGNMENTS:
      return { ...state, newAssignments: [], newAssignmentsLoading: true , newAssignmentsError:null }

    case GET_NEW_ASSIGNMENTS_SUCCESS:
      return {
        ...state,
        newAssignmentList: { ...state.newAssignmentList, [action.payload.page]: action.payload.res.data ,newAssignmentsError:null },
        newAssignments: action.payload.res,
        newAssignmentsLoading: false
      }

    case GET_NEW_ASSIGNMENTS_FAILURE:
      return { ...state, newAssignmentsLoading: false, newAssignmentsError: action.payload }

    case GET_PAST_ASSIGNMENTS:
      return { ...state, pastAssignments: [], pastAssignmentsLoading: true }

    case GET_PAST_ASSIGNMENTS_SUCCESS:
      return {
        ...state,
        pastAssignmentsList: { ...state.pastAssignmentsList, [action.payload.page]: action.payload.res.data },
        pastAssignments: action.payload.res,
        pastAssignmentsLoading: false,
        pastAssignmentsError: null
      }

    case GET_PAST_ASSIGNMENTS_FAILURE:
      return { ...state, pastAssignments: [], pastAssignmentsLoading: false, pastAssignmentsError: action.payload }

    case SELECT_ASSIGNMENT:
      return { ...state, selectedAssignment: action.payload, attempt: {}, assignment: {} }

    case GET_ASSIGNMENT_ATTEMPT:
      return { ...state, attempt: {}, attemptLoading: true }

    case GET_ASSIGNMENT_ATTEMPT_SUCCESS:
      return { ...state, attempt: action.payload, attemptLoading: false, attemptError: null }

    case GET_ASSIGNMENT_ATTEMPT_FAILURE:
      return { ...state, attempt: {}, attemptLoading: false, attemptError: action.payload }

    case GET_ASSIGNMENT:
      return { ...state, assignment: {}, assignmentLoading: true }

    case GET_ASSIGNMENT_SUCCESS:
      return { ...state, assignment: action.payload, assignmentLoading: false, assignmentError: null }

    case GET_ASSIGNMENT_FAILURE:
      return { ...state, assignment: {}, assignmentLoading: false, assignmentError: action.payload }

    case CREATE_ASSIGNMENT_ATTEMPT:
      return { ...state, createAttemptLoading: true, createAttemptError: null, }

    case CREATE_ASSIGNMENT_ATTEMPT_SUCCESS:
      return { ...state, attempt: action.payload, createAttemptLoading: false, createAttemptError: null }

    case CREATE_ASSIGNMENT_ATTEMPT_FAILURE:
      return { ...state, attempt: {}, createAttemptLoading: false, createAttemptError: action.payload }

    case SAVE_ANSWER:
      return saveAnswer(state, action.payload)

    case SUBMIT_ASSIGNMENT:
      return { ...state, assignmentSubmitLoading: true, assignmentSubmitError: null }

    case SUBMIT_ASSIGNMENT_SUCCESS:
      return submitAssignmentSuccess(state, action.payload)

    case SUBMIT_ASSIGNMENT_FAILURE:
      return submitAssignmentFailure(state, action.payload)

    default:
      return state
  }
}

export default assignmentReducer
