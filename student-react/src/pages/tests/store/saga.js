import { call, put, takeEvery } from "redux-saga/effects"


// Login Redux States
import {
  GET_UPCOMING_TESTS,
  GET_PAST_TESTS,
  NEW_TEST_ATTEMPT,
  SUBMIT_TEST_ATTEMPT,
  GET_TEST_ATTEMPT_DETAILS
} from "./actionTypes"


import {
  getPastTestsSuccess,
  getPastTestsFailure,
  getUpcomingTestsSuccess,
  getUpcomingTestsFailure,
  newTestAttemptFailure,
  newTestAttemptSuccess,
  submitTestAttemptFailure,
  submitTestAttemptSuccess,
  getTestAttemptDetailsSuccess,
  getTestAttemptDetailsFailure

} from "./actions"

//Include Both Helper File with needed methods
import {
  getPastTests,
  getUpcomingTests,
  newTestAttempt,
  submitTestAttempt,
  getTestAttemptDetails
} from "../../../helpers/backend-helpers"

function* getUpcomingTestsHttp({payload:data}) {
  try {
   
    const response = yield call(getUpcomingTests,data);
    if (response) {
      let res = {
        "res":response,
        "page":data.page
      }
      yield put(getUpcomingTestsSuccess(res))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(getUpcomingTestsFailure(error.message ? error.message : error))
  }
}

function* getPastTestsHttp({payload:data}) {
  try {
  
    const response = yield call(getPastTests,data);
    if (response) {
      let res = {
        "res":response,
        "page":data.page
      }
      yield put(getPastTestsSuccess(res))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(getPastTestsFailure(error.message ? error.message : error))
  }
}

function* newTestAttemptHttp({ payload: { id, data } }) {
  try {
    const response = yield call(newTestAttempt, data);
    if (response) {
      yield put(newTestAttemptSuccess({ id, data: response }))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {

    yield put(newTestAttemptFailure({ id, error: error.message ? error.message : error }))
  }
}

function* submitTestAttemptHttp({ payload }) {
  try {
    const response = yield call(submitTestAttempt, payload);
    if (response) {
      yield put(submitTestAttemptSuccess(response))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(submitTestAttemptFailure({
      error: error.message ? error.message : error,
      isSubmitted: error.data ? error.data.isSubmitted : null
    }))
  }
}

function* getTestAttemptDetailsHttp({ payload }) {
  try {
    const response = yield call(getTestAttemptDetails, payload);
    if (response) {
      yield put(getTestAttemptDetailsSuccess(response))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(getTestAttemptDetailsFailure(error.message ? error.message : error))
  }
}

function* testSaga() {
  yield takeEvery(GET_UPCOMING_TESTS, getUpcomingTestsHttp)
  yield takeEvery(GET_PAST_TESTS, getPastTestsHttp)
  yield takeEvery(NEW_TEST_ATTEMPT, newTestAttemptHttp)
  yield takeEvery(SUBMIT_TEST_ATTEMPT, submitTestAttemptHttp)
  yield takeEvery(GET_TEST_ATTEMPT_DETAILS, getTestAttemptDetailsHttp)
}

export default testSaga
