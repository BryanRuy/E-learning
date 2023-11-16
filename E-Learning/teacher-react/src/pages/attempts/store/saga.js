import { call, put, takeEvery } from "redux-saga/effects"


import {
    GET_TEST_ATTEMPTS,
    GET_ATTEMPT_DETAIL,
    GET_TEST_DETAIL,
    PUT_SUBJECTIVE_ATTEMPT_MARKS
} from './actionTypes'

import {
    getTestAttemptsSuccess, getTestAttemptsFailure,
    getAttemptDetailSuccess, getAttemptDetailFailure,
    getTestDetailSuccess, getTestDetailFailure,
    putSubjectiveAttemptMarksSuccess, putSubjectiveAttemptMarksFailure
} from "./actions"

import {
    getStudentTestAttempts,
    getAttemptDetail,
    getTestDetail,
    putAttemptSubjectiveMarks,
} from '@helpers/backend-helpers'


function* getTestAttemptsHttp({ payload: { studentId, testId } }) {
    try {
        const response = yield call(getStudentTestAttempts, studentId, testId);
        yield put(getTestAttemptsSuccess(response))
    } catch (error) {
        yield put(getTestAttemptsFailure(error))
    }
}

function* getAttemptDetailsHttp({ payload: { attemptId } }) {
    try {
        const response = yield call(getAttemptDetail, attemptId);
        yield put(getAttemptDetailSuccess(response))
    } catch (error) {
        yield put(getAttemptDetailFailure(error))
    }
}

function* getTestDetailsHttp({ payload: { testId } }) {
    try {
        const response = yield call(getTestDetail, testId);
        yield put(getTestDetailSuccess(response))
    } catch (error) {
        yield put(getTestDetailFailure(error))
    }
}

function* putSubjectiveAttemptMarksHttp({ payload: { attemptId, data } }) {
    try {
        const response = yield call(putAttemptSubjectiveMarks, attemptId, data);
        yield put(putSubjectiveAttemptMarksSuccess(response))
    } catch (error) {
        yield put(putSubjectiveAttemptMarksFailure(error))
    }
}


function* AttemptsSaga() {
    yield takeEvery(GET_TEST_ATTEMPTS, getTestAttemptsHttp)
    yield takeEvery(GET_ATTEMPT_DETAIL, getAttemptDetailsHttp)
    yield takeEvery(GET_TEST_DETAIL, getTestDetailsHttp)
    yield takeEvery(PUT_SUBJECTIVE_ATTEMPT_MARKS, putSubjectiveAttemptMarksHttp)
}

export default AttemptsSaga
