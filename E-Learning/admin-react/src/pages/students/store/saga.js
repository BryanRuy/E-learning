import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import { GET_STUDENTS_STATS,
         GET_STUDENT_DETAILS ,
         GET_ALL_STUDENTS ,
         GET_STUDENT_NEW_OR_WAITING_STATUS,
         GET_ACTIVE_STUDENTS
        } from "./actionTypes"
import {
    getStudentsStatsSuccess, getStudentsStatsFailure,
    getStudentDetailsSuccess, getStudentDetailsFailure,
    getAllStudentsSuccess, getAllStudentsFailure,
    getStudentNewOrWaitingStatusSuccess, getStudentNewOrWaitingStatusFailure,
    getActiveStudentsSuccess,getActiveStudentsFailure
} from "./actions"

//Include Both Helper File with needed methods
import { getStudentsStats, getStudent , getAllStudents ,
     getStudentOfStatusNewOrWaiting ,getActiveStudents} from "../../../helpers/backend-helpers";


function* getStudentsStatsHttp() {
    try {
        const response = yield call(getStudentsStats);
        if (response) {
            yield put(getStudentsStatsSuccess(response))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(getStudentsStatsFailure(error.message ? error.message : error))
    }
}

function* getStudentDetailsHttp({ payload }) {
    try {
        const response = yield call(getStudent, payload);
        if (response) {
            yield put(getStudentDetailsSuccess(response))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(getStudentDetailsFailure(error.message ? error.message : error))
    }
}

function* getAllStudentsHttp({payload:data}) {
    try {
        const response = yield call(getAllStudents,data);
        if (response) {
            let res = {
                "res":response,
                "page":data.page
            }
            yield put(getAllStudentsSuccess(res))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(getAllStudentsFailure(error.message ? error.message : error))
    }
}

function* getStudentsNewOrWaitingStatusHttp({payload:data}) {
    try {
        const response = yield call(getStudentOfStatusNewOrWaiting, data);
        if (response) {
            let res = {
                "res":response,
                "page":data.page
            }
            yield put(getStudentNewOrWaitingStatusSuccess(res))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(getStudentNewOrWaitingStatusFailure(error.message ? error.message : error))
    }
}

function* getActiveStudentsHttp({payload:data}) {
    try {
        const response = yield call(getActiveStudents,data);
        if (response) {
            let res = {
                "res":response,
                "page":data.page
            }
            yield put(getActiveStudentsSuccess(res))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(getActiveStudentsFailure(error.message ? error.message : error))
    }
}



function* StudentsSaga() {
    yield takeEvery(GET_STUDENTS_STATS, getStudentsStatsHttp)
    yield takeEvery(GET_STUDENT_DETAILS, getStudentDetailsHttp)
    yield takeEvery(GET_ALL_STUDENTS, getAllStudentsHttp)
    yield takeEvery(GET_STUDENT_NEW_OR_WAITING_STATUS, getStudentsNewOrWaitingStatusHttp)
    yield takeEvery(GET_ACTIVE_STUDENTS, getActiveStudentsHttp)
}

export default StudentsSaga
