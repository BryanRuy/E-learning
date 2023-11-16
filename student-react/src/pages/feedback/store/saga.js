import { takeEvery, fork, put, all, call } from "redux-saga/effects"

// Login Redux States
import { POST_FEEDBACK } from "./actionTypes"
import { postFeedbackSuccess, postFeedbackError } from "./actions"
import { postFeedback } from "../../../helpers/backend-helpers"

//Include Both Helper File with needed methods
function* postFeedbackHttp({ payload: { feedback } }) {
  try {
    const response = yield call(postFeedback, feedback)
    yield put(postFeedbackSuccess(response))
  } catch (error) {
    yield put(postFeedbackError(error))
  }
}

function* FeedbackSaga() {
  yield takeEvery(POST_FEEDBACK, postFeedbackHttp)
}

export default FeedbackSaga

