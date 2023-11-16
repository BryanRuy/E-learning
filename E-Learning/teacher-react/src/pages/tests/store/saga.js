import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import {
    GET_TEACHER_UPCOMING_TESTS,
    GET_TEACHER_PAST_TESTS,
    GET_STUDENT_TESTS,
    GET_TEACHER_TESTS,
    POST_TEST,
    PUT_TEST,
    ASSIGN_TEST,
    GET_PAST_STUDENT,
    GET_UPCOMING_STUDENT,
    UNASSIGN_TEST,
    GET_TEST_BY_ID
} from "./actionTypes"

import {
    getTeacherPastTestsSuccess, getTeacherPastTestsFailure, 
    getTeacherUpcomingTestsSuccess, getTeacherUpcomingTestsFailure,
    getStudentTestsSuccess, getStudentTestsFailure,
    getTeacherTestsSuccess, getTeacherTestsFailure,
    postTestSuccess, postTestFailure,
    putTestSuccess, putTestFailure,
    assignTestSuccess, assignTestFailure,
    getPastStudentSuccess, getPastStudentFailure,
    getUpcomingStudentSuccess, getUpcomingStudentFailure,
    unassignTestSuccess, unassignTestFailure,
    getTestByIdSuccess, getTestByIdFailure,
} from "./actions"

import {
    getUpcomingTests,
    getPastTests,
    getAllStudentTest,
    getTests,
    postTest,
    putTest,
    assignTest,
    getTestPastStudent,
    getTestUpcomingStudent,
    unassignTest,
    getTestById
} from '@helpers/backend-helpers'


function* getStudentTestsHttp({ payload: data }) {
    try {
        const response = yield call(getAllStudentTest, data);
       let res = {
           "res":response,
           "page":data.page
       }
       
        yield put(getStudentTestsSuccess(res))
    } catch (error) {
        yield put(getStudentTestsFailure(error))
    }
}

function* getTeacherTestsHttp({payload:data}) {
    try {
        const response = yield call(getTests, data);
        let res ={
            "res":response,
            "page":data.page
        }
        yield put(getTeacherTestsSuccess(res))
    } catch (error) {
        yield put(getTeacherTestsFailure(error))
    }
}

function* postTestHttp({ payload: { test } }) {
    try {
        const response = yield call(postTest, test);
        yield put(postTestSuccess(response))
    } catch (error) {
        yield put(postTestFailure(error))
    }
}

function* putTestHttp({ payload: { test } }) {
    try {
        const response = yield call(putTest, test);
        yield put(putTestSuccess(response))
    } catch (error) {
        yield put(putTestFailure(error))
    }
}

function* assignTestHttp({ payload: { data } }) {
    try {
        const response = yield call(assignTest, data.testId, data);
        yield put(assignTestSuccess(response))
    } catch (error) {
        yield put(assignTestFailure(error))
    }
}

function* getPastStudentHttp({ payload: testId }) {
    try {
        const response = yield call(getTestPastStudent, testId);
        yield put(getPastStudentSuccess(response))
    } catch (error) {
        yield put(getPastStudentFailure(error))
    }
}

function* getUpcomingStudentHttp({ payload: testId }) {
    try {
        const response = yield call(getTestUpcomingStudent, testId);
        yield put(getUpcomingStudentSuccess(response))
    } catch (error) {
        yield put(getUpcomingStudentFailure(error))
    }
}

function* unassignStudentTestHttp({ payload: { data } }) {
    try {
        let studentTestId = { "studentTestId": data.studentTestId }
        const response = yield call(unassignTest, data.testId, studentTestId);
        yield put(unassignTestSuccess(response))
    } catch (error) {
        yield put(unassignTestFailure(error))
    }
}

function* getTeacherUpcomingTestsHttp() {
    try {
        const response = yield call(getUpcomingTests);
        if (response) {
            yield put(getTeacherUpcomingTestsSuccess(response))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(getTeacherUpcomingTestsFailure(error.message ? error.message : error))
    }
}

function* getTeacherPastTestsHttp() {
    try {
        const response = yield call(getPastTests);
        if (response) {
            yield put(getTeacherPastTestsSuccess(response))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(getTeacherPastTestsFailure(error.message ? error.message : error))
    }
}

function* getTestByIdHttp({payload:testId}) {
    try {
        const response = yield call(getTestById,testId);
        if (response) {
            
            yield put(getTestByIdSuccess(response))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(getTestByIdFailure(error.message ? error.message : error))
    }
}

function* TestsSaga() {

    yield takeEvery(GET_TEACHER_UPCOMING_TESTS, getTeacherUpcomingTestsHttp)
    yield takeEvery(GET_TEACHER_PAST_TESTS, getTeacherPastTestsHttp)
    yield takeEvery(GET_STUDENT_TESTS, getStudentTestsHttp)
    yield takeEvery(GET_TEACHER_TESTS, getTeacherTestsHttp)
    yield takeEvery(POST_TEST, postTestHttp)
    yield takeEvery(PUT_TEST, putTestHttp)
    yield takeEvery(ASSIGN_TEST, assignTestHttp)
    yield takeEvery(GET_PAST_STUDENT, getPastStudentHttp)
    yield takeEvery(GET_UPCOMING_STUDENT, getUpcomingStudentHttp)
    yield takeEvery(UNASSIGN_TEST, unassignStudentTestHttp)
    yield takeEvery(GET_TEST_BY_ID, getTestByIdHttp)
}

export default TestsSaga
