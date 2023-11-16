import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import { GET_TEACHERS_STATS, 
        GET_TEACHER_DETAILS,
        GET_ALL_TEACHERS ,
        GET_TEACHER_STUDENTS } from "./actionTypes"
import {
    getTeachersStatsSuccess, getTeachersStatsFailure,
    getTeacherDetailsSuccess, getTeacherDetailsFailure,
    getAllTeachersSuccess, getAllTeachersFailure,
    getTeacherStudentsSuccess, getTeacherStudentsFailure
} from "./actions"

//Include Both Helper File with needed methods
import { getTeachersStats, getTeacher , getAllTeachers , getTeacherStudents } from "../../../helpers/backend-helpers";


function* getTeachersStatsHttp() {
    try {
        const response = yield call(getTeachersStats);
        if (response) {
            yield put(getTeachersStatsSuccess(response))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(getTeachersStatsFailure(error.message ? error.message : error))
    }
}

function* getTeacherDetailsHttp({ payload }) {
    try {
        const response = yield call(getTeacher, payload);
        if (response) {
            yield put(getTeacherDetailsSuccess(response))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(getTeacherDetailsFailure(error.message ? error.message : error))
    }
}

function* getAllTeachersHttp({payload:data}) {
    try {
        
        const response = yield call(getAllTeachers, data);
        if (response) {
            let res = {
                "res":response,
                "page":data.page
            }
            yield put(getAllTeachersSuccess(res))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(getAllTeachersFailure(error.message ? error.message : error))
    }
}

function* getTeacherStudentsHttp({ payload }) {
    try {
        const response = yield call(getTeacherStudents, payload);
        if (response) {
            yield put(getTeacherStudentsSuccess(response))
            return;
        }
        throw "Unknown response received from Server";

    } catch (error) {
        yield put(getTeacherStudentsFailure(error.message ? error.message : error))
    }
}


function* teachersSaga() {
    yield takeEvery(GET_TEACHERS_STATS, getTeachersStatsHttp)
    yield takeEvery(GET_TEACHER_DETAILS, getTeacherDetailsHttp)
    yield takeEvery(GET_ALL_TEACHERS, getAllTeachersHttp)
    yield takeEvery(GET_TEACHER_STUDENTS, getTeacherStudentsHttp)
}

export default teachersSaga
