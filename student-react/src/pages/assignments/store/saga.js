import { call, put, takeEvery } from "redux-saga/effects"


// Login Redux States
import {
  GET_NEW_ASSIGNMENTS,
  GET_PAST_ASSIGNMENTS,
  GET_ASSIGNMENT_ATTEMPT,
  GET_ASSIGNMENT,
  CREATE_ASSIGNMENT_ATTEMPT,
  SUBMIT_ASSIGNMENT
} from "./actionTypes"


import {
  getNewAssignmentsFailure,
  getNewAssignmentsSuccess,
  getPastAssignmentsFailure,
  getPastAssignmentsSuccess,
  getAssignmentAttemptSuccess,
  getAssignmentAttemptFailure,
  getAssignmentSuccess,
  getAssignmentFailure,
  createAssignmentAttemptSuccess,
  createAssignmentAttemptFailure,
  submitAssignmentSuccess,
  submitAssignmentFailure

} from "./actions"

//Include Both Helper File with needed methods
import {
  getPastAssignments,
  getNewAssignments,
  getAssignmentAttempt,
  getAssignment,
  createAssignmentAttempt,
  submitAssignment
} from "../../../helpers/backend-helpers"

function* getNewAssignmentsHttp({payload:data}) {
  try {
    const response = yield call(getNewAssignments,data);
    if (response) {
      let res = {
        "res":response,
        "page":data.page
      }
      yield put(getNewAssignmentsSuccess(res))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(getNewAssignmentsFailure(error.message ? error.message : error))
  }
}

function* getPastAssignmentsHttp({payload:data}) {
  try {
    const response = yield call(getPastAssignments,data);
    if (response) {
      let res ={
        "res":response,
        "page":data.page
      }
      yield put(getPastAssignmentsSuccess(res))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(getPastAssignmentsFailure(error.message ? error.message : error))
  }
}

function* getAssignmentAttemptHttp({ payload }) {
  try {
    const response = yield call(getAssignmentAttempt, payload);
    if (response) {
      yield put(getAssignmentAttemptSuccess(response))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(getAssignmentAttemptFailure(error.message ? error.message : error))
  }
}

function* getAssignmentHttp({ payload }) {
  try {
    const response = yield call(getAssignment, payload);
    if (response) {
      yield put(getAssignmentSuccess(response))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(getAssignmentFailure(error.message ? error.message : error))
  }
}

function* createAssignmentAttemptHttp({ payload }) {
  try {
    const response = yield call(createAssignmentAttempt, payload);
    if (response) {
      yield put(createAssignmentAttemptSuccess(response))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(createAssignmentAttemptFailure(error.message ? error.message : error))
  }
}

function* submitAssignmentHttp({ payload: { id, data } }) {
  try {
    const response = yield call(submitAssignment, data);
    if (response) {
      yield put(submitAssignmentSuccess({ id, data: response }))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(submitAssignmentFailure({
      id,
      error: error.message ? error.message : error,
      isSubmitted: error.data ? error.data.isSubmitted : null
    }))
  }
}

function* assignmentSaga() {
  yield takeEvery(GET_NEW_ASSIGNMENTS, getNewAssignmentsHttp)
  yield takeEvery(GET_PAST_ASSIGNMENTS, getPastAssignmentsHttp)
  yield takeEvery(GET_ASSIGNMENT_ATTEMPT, getAssignmentAttemptHttp)
  yield takeEvery(GET_ASSIGNMENT, getAssignmentHttp)
  yield takeEvery(CREATE_ASSIGNMENT_ATTEMPT, createAssignmentAttemptHttp)
  yield takeEvery(SUBMIT_ASSIGNMENT, submitAssignmentHttp)
}

export default assignmentSaga
