import { call, put, takeEvery } from "redux-saga/effects"

// Login Redux States
import {
    GET_ADMIN_MEETING,
    NEW_ADMIN_MEETING,
    UPDATE_ADMIN_MEETING,
    GET_STARTED_CONTENT
} from "./actionTypes"
import {
    getAdminMeetingSuccess, getAdminMeetingError,
    newAdminMeetingSuccess, newAdminMeetingFailure,
    updateAdminMeetingSuccess, updateAdminMeetingFailure,
    getStartedContentSuccess, getStartedContentError

} from "./actions"

import {
    getLoggedInUser, getMeetingWithAdmin,
    newAdminMeeting, updateMeeting,
    getStartedContent
} from '../../../helpers/backend-helpers'


function* getAdminMeetingHttp() {
    try {
        let user = getLoggedInUser();
        const response = yield call(getMeetingWithAdmin, user.userId);
        yield put(getAdminMeetingSuccess(response))
    } catch (error) {
        yield put(getAdminMeetingError(error.message ? error.message : error))
    }
}

function* newAdminMeetingHttp({ payload }) {
    try {
        const response = yield call(newAdminMeeting, payload);
        yield put(newAdminMeetingSuccess(response))
    } catch (error) {
        yield put(newAdminMeetingFailure(error.message ? error.message : error))
    }
}

function* updateAdminMeetingHttp({ payload: { id, action, data } }) {
    try {
        const response = yield call(updateMeeting, id, action, data);
        yield put(updateAdminMeetingSuccess(response))
    } catch (error) {
        yield put(updateAdminMeetingFailure(error.message ? error.message : error))
    }
}


function* getStartedContentHttp() {
    try {
        const response = yield call(getStartedContent);
        yield put(getStartedContentSuccess(response))
    } catch (error) {
        yield put(getStartedContentError(error.message ? error.message : error))
    }
}

function* GetStartedSaga() {
    yield takeEvery(GET_ADMIN_MEETING, getAdminMeetingHttp)
    yield takeEvery(NEW_ADMIN_MEETING, newAdminMeetingHttp)
    yield takeEvery(UPDATE_ADMIN_MEETING, updateAdminMeetingHttp)
    yield takeEvery(GET_STARTED_CONTENT, getStartedContentHttp)
}

export default GetStartedSaga
