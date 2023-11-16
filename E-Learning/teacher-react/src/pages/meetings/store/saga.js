import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import {
    GET_ALL_MEETINGS,
    GET_MEETING_DATES,
    NEW_MEETING,
    UPDATE_MEETING,
    GET_STUDENTS_FOR_MEETING,
    GET_MEETING_TOKEN
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
    getStudentsForMeetingFailure,
    getStudentsForMeetingSuccess,
    getMeetingTokenSuccess,
    getMeetingTokenFailure

} from "./actions"
import {
    getLoggedInUser,
    getStudentAllMeetings,
    getMeetingDates,
    newMeeting,
    updateMeeting,
    getAllStudents,
    getMeetingToken

} from '@helpers/backend-helpers'


function* getAllMeetingsHttp({payload:data}) {
    try {
        let user = getLoggedInUser();
        data.userId = user.userId
        const response = yield call(getStudentAllMeetings, data);
        yield put(getAllMeetingsSuccess(response))
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


function* getStudentsForMeetingHttp({payload:data}) {
    try {
        const response = yield call(getAllStudents, data);
        yield put(getStudentsForMeetingSuccess(response))
    } catch (error) {
        yield put(getStudentsForMeetingFailure(error.message ? error.message : error))
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



function* MeetingsSaga() {
    yield takeEvery(GET_ALL_MEETINGS, getAllMeetingsHttp)
    yield takeEvery(GET_MEETING_DATES, getMeetingDatesHttp)
    yield takeEvery(NEW_MEETING, newMeetingHttp)
    yield takeEvery(UPDATE_MEETING, updateMeetingHttp)
    yield takeEvery(GET_STUDENTS_FOR_MEETING, getStudentsForMeetingHttp)
    yield takeEvery(GET_MEETING_TOKEN, getMeetingTokenHttp)
}

export default MeetingsSaga
