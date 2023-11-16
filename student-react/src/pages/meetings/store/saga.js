import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import {
    GET_ALL_MEETINGS,
    GET_MEETING_DATES,
    NEW_MEETING,
    UPDATE_MEETING,
    GET_MEETING_TOKEN,
    GET_CURRENT_TEACHER
} from "./actionTypes"
import {
    getAllMeetingsSuccess,
    getAllMeetingsError,
    getMeetingDatesSuccess,
    getMeetingDatesFailure,
    newMeetingFailure,
    newMeetingSuccess,
    updateMeetingSuccess,
    updateMeetingFailure,
    getMeetingTokenSuccess,
    getMeetingTokenFailure,
    getCurrentTeacherSuccess,
    getCurrentTeacherFailure

} from "./actions"
import {
    getLoggedInUser,
    getStudentAllMeetings,
    getMeetingDates,
    newMeeting,
    updateMeeting,
    getMeetingToken,
    getCurrentTeacher
} from '@helpers/backend-helpers'


function* getAllMeetingsHttp({payload:data}) {
    try {
        let user = getLoggedInUser();
        data.userId = user.userId
        const response = yield call(getStudentAllMeetings, data);
        let res = {
            "res":response,
            "page":data.page
          }
        yield put(getAllMeetingsSuccess(res))
    } catch (error) {
        yield put(getAllMeetingsError(error.message ? error.message : error))
    }
}

function* getMeetingDatesHttp({ payload }) {
    try {
        const response = yield call(getMeetingDates, payload);
        yield put(getMeetingDatesSuccess(response))
    } catch (error) {
        yield put(getMeetingDatesFailure(error.message ? error.message : error))
    }
}

function* newMeetingHttp({ payload }) {
    try {
        const response = yield call(newMeeting, payload);
        yield put(newMeetingSuccess(response))
    } catch (error) {
        yield put(newMeetingFailure(error.message ? error.message : error))
    }
}

function* updateMeetingHttp({ payload: { id, action, data } }) {
    try {
        const response = yield call(updateMeeting, id, action, data);
        yield put(updateMeetingSuccess({ id, data: response }))
    } catch (error) {
        yield put(updateMeetingFailure({ id, error: error.message ? error.message : error }))
    }
}


function* getMeetingTokenHttp() {
    try {
        const response = yield call(getMeetingToken);
        yield put(getMeetingTokenSuccess(response))
    } catch (error) {
        yield put(getMeetingTokenFailure(error.message ? error.message : error))
    }
}

function* getCurrentTeacherHttp() {
    try {
        const response = yield call(getCurrentTeacher);
        yield put(getCurrentTeacherSuccess(response))
    } catch (error) {
        yield put(getCurrentTeacherFailure(error.message ? error.message : error))
    }
}


function* MeetingsSaga() {
    yield takeEvery(GET_ALL_MEETINGS, getAllMeetingsHttp)
    yield takeEvery(GET_MEETING_DATES, getMeetingDatesHttp)
    yield takeEvery(NEW_MEETING, newMeetingHttp)
    yield takeEvery(UPDATE_MEETING, updateMeetingHttp)
    yield takeEvery(GET_MEETING_TOKEN, getMeetingTokenHttp)
    yield takeEvery(GET_CURRENT_TEACHER, getCurrentTeacherHttp)
}

export default MeetingsSaga
