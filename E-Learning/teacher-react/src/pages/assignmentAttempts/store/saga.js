import { call, put, takeEvery } from "redux-saga/effects"


import {
    GET_ASSIGNMENT_ATTEMPTS,
    GET_ASSIGNMENT_ATTEMPT_DETAIL,
    GET_ASSIGNMENT_DETAIL
} from './actionTypes'

import {
    getAssignmentAttemptsSuccess, getAssignmentAttemptsFailure,
    getAssignmentAttemptDetailSuccess, getAssignmentAttemptDetailFailure,
    getAssignmentDetailSuccess, getAssignmentDetailFailure
} from "./actions"

import {
    getStudentAssignmentAttempts,
    getAssignmentAttemptDetail,
    getAssignmentDetail
} from '@helpers/backend-helpers'


function* getAssignmentAttemptsHttp({ payload: { studentId, assignmentId } }) {
    try {
        const response = yield call(getStudentAssignmentAttempts, studentId, assignmentId);
        yield put(getAssignmentAttemptsSuccess(response))
    } catch (error) {
        yield put(getAssignmentAttemptsFailure(error))
    }
}

function* getAssignmentAttemptDetailsHttp({ payload: { assignmentAttemptId } }) {
    try {
        const response = yield call(getAssignmentAttemptDetail, assignmentAttemptId);
        yield put(getAssignmentAttemptDetailSuccess(response))
    } catch (error) {
        yield put(getAssignmentAttemptDetailFailure(error))
    }
}

function* getAssignmentDetailsHttp({ payload: { assignmentId } }) {
    try {
        const response = yield call(getAssignmentDetail, assignmentId);
        yield put(getAssignmentDetailSuccess(response))
    } catch (error) {
        yield put(getAssignmentDetailFailure(error))
    }
}




function* AssignmentAttemptsSaga() {
    yield takeEvery(GET_ASSIGNMENT_ATTEMPTS, getAssignmentAttemptsHttp)
    yield takeEvery(GET_ASSIGNMENT_ATTEMPT_DETAIL, getAssignmentAttemptDetailsHttp)
    yield takeEvery(GET_ASSIGNMENT_DETAIL, getAssignmentDetailsHttp)
}

export default AssignmentAttemptsSaga
