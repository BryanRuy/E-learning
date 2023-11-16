



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


let TEST_KEY = "ATTEMPT_TEST_OBJECT"

let testObj = JSON.parse(localStorage.getItem(TEST_KEY) || "{}")


const initialState = {
  newTestList:{},
  newTests: [],
  newTestsLoading: false,
  newTestsError: null,

  pastTestList:{},
  pastTests: [],
  pastTestsLoading: false,
  pastTestsError: null,

  attemptTestLoading: false,
  selectedTest: testObj.test || {},
  currentIndex: testObj.currentIndex || 0,
  attemptId: testObj.attemptId || null,
  testStartTime: testObj.testStartTime || null,
  attemptTestError: null,
  submitTestLoading: false,
  submitTestError: null,
  attemptDetails: {},
  attemptDetailsLoading: false,
  attemptDetailsError: null
}


const newTestAttemptSuccess = (state, payload) => {
  state.attemptId = payload.data.attemptId
  state.selectedTest.test = payload.data.test
  state.currentIndex = 0;
  state.testStartTime = payload.data.createdAt
  updateTestStorage(state)

  return {
    ...state,
    selectedTest: { ...state.selectedTest },
    currentIndex: 0,
    testStartTime: payload.data.createdAt,
    attemptTestLoading: false,
    attemptTestError: null
  }
}

const updateTestStorage = (state) => {
  localStorage.setItem(TEST_KEY, JSON.stringify({
    test: state.selectedTest,
    currentIndex: state.currentIndex,
    attemptId: state.attemptId,
    testStartTime: state.testStartTime
  }))
}

const updateSubjectiveQuestion = (state, payload) => {
  state.selectedTest.test.questions[state.currentIndex].answerText = payload
  updateTestStorage(state)
  return {
    ...state,
    selectedTest: { ...state.selectedTest }
  }
}

const updateObjectiveQuestion = (state, payload) => {
  state.selectedTest.test.questions[state.currentIndex].options.forEach(o => {
    if (o.optionId == payload.id) {
      o.selected = true
    } else {
      o.selected = false
    }
  });
  updateTestStorage(state)
  return {
    ...state,
    selectedTest: { ...state.selectedTest }
  }
}

const nextQuestion = (state) => {
  if (state.selectedTest.test) {
    if (state.currentIndex < state.selectedTest.test.questions.length - 1 &&
      state.selectedTest.test.questions.length > 0) {
      state.currentIndex++
      updateTestStorage(state)
    }
  }
  return {
    ...state
  }
}

const previousQuestion = (state) => {
  if (state.selectedTest.test) {
    if (state.currentIndex > 0 && state.selectedTest.test.questions.length > 0) {
      state.currentIndex--
      updateTestStorage(state)
    }
  }
  return {
    ...state
  }
}

const selectQuestion = (state, payload) => {
  if (state.selectedTest.test) {
    if (payload.index > -1 && payload.index < state.selectedTest.test.questions.length && state.selectedTest.test.questions.length > 0) {
      state.currentIndex = payload.index;
      updateTestStorage(state)
    }
  }
  return {
    ...state
  }
}

const submitTestAttemptSuccess = (state, payload) => {
  state = {
    ...state,
    submitTestError: null,
    submitTestLoading: false,
    attemptId: null,
    selectedTest: {},
    currentIndex: 0,
    testStartTime: null
  }
  updateTestStorage(state)

  return state
}

const submitTestAttemptFailure = (state, payload) => {
  if (payload.isSubmitted) {
    state = {
      ...state,
      attemptId: null,
      selectedTest: {},
      currentIndex: 0,
      testStartTime: null
    }
    updateTestStorage(state)
  }

  return {
    ...state,
    submitTestError: payload.error,
    submitTestLoading: false
  }
}


const testReducer = (state = initialState, action) => {
  switch (action.type) {

    case GET_UPCOMING_TESTS:
     return { ...state, newTests: [], newTestsLoading: true }

    case GET_UPCOMING_TESTS_SUCCESS:
      return { ...state, newTestList:{...state.newTestList ,[action.payload.page]: action.payload.res.data}, newTests: action.payload.res, newTestsLoading: false, newTestsError: null }

    case GET_UPCOMING_TESTS_FAILURE:
      return { ...state, newTests: [], newTestsLoading: false, newTestsError: action.payload }

    case GET_PAST_TESTS:
     return { ...state, pastTests: [], pastTestsLoading: true }

    case GET_PAST_TESTS_SUCCESS:  
      return { ...state, pastTestList:{...state.pastTestList ,[action.payload.page]: action.payload.res.data}, pastTests: action.payload.res, pastTestsLoading: false, pastTestsError: null }

    case GET_PAST_TESTS_FAILURE:
      return { ...state, pastTests: [], pastTestsLoading: false, pastTestsError: action.payload }

    case NEW_TEST_ATTEMPT:
      return { ...state, attemptTestLoading: true, attemptTestError: null }

    case NEW_TEST_ATTEMPT_SUCCESS:
      return newTestAttemptSuccess(state, action.payload)

    case NEW_TEST_ATTEMPT_FAILURE:
      return { ...state, attemptTestLoading: false, attemptTestError: action.payload.error }

    case UPDATE_SUBJECTIVE_QUESTION:
      return updateSubjectiveQuestion(state, action.payload)

    case UPDATE_OBJECTIVE_QUESTION:
      return updateObjectiveQuestion(state, action.payload)

    case NEXT_QUESTION:
      return nextQuestion(state)

    case PREVIOUS_QUESTION:
      return previousQuestion(state)

    case SELECT_QUESTION:
      return selectQuestion(state, action.payload)

    case SUBMIT_TEST_ATTEMPT:
      return {
        ...state,
        submitTestLoading: true
      }

    case SUBMIT_TEST_ATTEMPT_SUCCESS:
      return submitTestAttemptSuccess(state, action.payload)

    case SUBMIT_TEST_ATTEMPT_FAILURE:
      return submitTestAttemptFailure(state, action.payload)

    case GET_TEST_ATTEMPT_DETAILS:
      return { ...state, attemptDetailsLoading: true, attemptDetailsError: null }

    case GET_TEST_ATTEMPT_DETAILS_SUCCESS:
      return { ...state, attemptDetails: action.payload, attemptDetailsLoading: false, attemptDetailsError: null }

    case GET_TEST_ATTEMPT_DETAILS_FAILURE:
      return { ...state, attemptDetails: [], attemptDetailsLoading: false, attemptDetailsError: action.payload }

    default:
      return state
  }
}

export default testReducer
