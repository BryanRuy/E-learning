import { call, put, takeEvery } from "redux-saga/effects"

import {
  GET_TEACHER_HISTORY_STATS,
  GET_STUDENT_HISTORY_STATS,
  GET_TEACHER_PAYMENT_PLAN,
  POST_TEACHER_PAYMENT_PLAN,
  UPDATE_TEACHER_PAYMENT_PLAN,
} from "./actionTypes"


import {
  getTeacherHistoryStatsSuccess, getTeacherHistoryStatsFailure,
  getStudentHistoryStatsSuccess, getStudentHistoryStatsFailure,
  getTeacherPaymentPlanSuccess, getTeacherPaymentPlanFailure,
  postTeacherPaymentPlanSuccess, postTeacherPaymentPlanFailure,
  updateTeacherPaymentPlanSuccess, updateTeacherPaymentPlanFailure
} from "./actions"

import { getTeacherHistoryStats, getStudentHistoryStats,
  getTeacherPaymentPlan,
  postTeacherPaymentPlan,
  putTeacherPaymentPlan, } from '../../../helpers/backend-helpers'

function* getTeacherHistoryStatsHttp({ payload: data }) {
  try {
    const response = yield call(getTeacherHistoryStats, data.teacherId);
    if (response) {
      yield put(getTeacherHistoryStatsSuccess(response))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(getTeacherHistoryStatsFailure(error))
  }
}

function* getStudentHistoryStatsHttp({ payload: data }) {
  try {
    const response = yield call(getStudentHistoryStats, data.studentId);
    if (response) {
      yield put(getStudentHistoryStatsSuccess(response))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(getStudentHistoryStatsFailure(error))
  }
}

function* getTeacherPaymentPlanHttp({ payload: data }) {
  try {
    const response = yield call(getTeacherPaymentPlan, data);
    if (response) {
      yield put(getTeacherPaymentPlanSuccess(response))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(getTeacherPaymentPlanFailure(error))
  }
}

function* postTeacherPaymentPlanHttp({ payload: data }) {
  try {
    const response = yield call(postTeacherPaymentPlan, data.userId, data);
    if (response) {
      yield put(postTeacherPaymentPlanSuccess(response))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(postTeacherPaymentPlanFailure(error))
  }
}

function* updateTeacherPaymentPlanHttp({ payload: data }) {
  try {
    const response = yield call(putTeacherPaymentPlan, data.userId, data);
    if (response) {
      yield put(updateTeacherPaymentPlanSuccess(response))
      return;
    }
    throw "Unknown response received from Server";

  } catch (error) {
    yield put(updateTeacherPaymentPlanFailure(error))
  }
}



function* HistorySaga() {
  yield takeEvery(GET_TEACHER_HISTORY_STATS, getTeacherHistoryStatsHttp)
  yield takeEvery(GET_STUDENT_HISTORY_STATS, getStudentHistoryStatsHttp)
  yield takeEvery(GET_TEACHER_PAYMENT_PLAN, getTeacherPaymentPlanHttp)
  yield takeEvery(POST_TEACHER_PAYMENT_PLAN, postTeacherPaymentPlanHttp)
  yield takeEvery(UPDATE_TEACHER_PAYMENT_PLAN, updateTeacherPaymentPlanHttp)
}

export default HistorySaga
