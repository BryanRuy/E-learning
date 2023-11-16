import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import {
    GET_STUDENTS,
    GET_STUDENT_BY_ID
} from "./actionTypes"
import {
    getStudentsSuccess,
    getStudentsFailure,
    getStudentByIdSuccess,
    getStudentByIdFailure
} from "./actions"
import { getAllStudents, getStudentProfile } from '@helpers/backend-helpers'



function* getAllStudentsHttp({payload:data}) {
    try {
        const response = yield call(getAllStudents,data);
        let res = {
            "res":response,
            "page":data.page
        }
        yield put(getStudentsSuccess(res))
    } catch (error) {
        yield put(getStudentsFailure(error))
    }
}

function* getStudentProfileHttp({ payload: studentId }) {
    try {
        const response = yield call(getStudentProfile, studentId);
        yield put(getStudentByIdSuccess(response))
    } catch (error) {
        yield put(getStudentByIdFailure(error))
    }
}

function* StudentsSaga() {
    yield takeEvery(GET_STUDENTS, getAllStudentsHttp)
    yield takeEvery(GET_STUDENT_BY_ID, getStudentProfileHttp)
}

export default StudentsSaga
