import {
    GET_ADMIN_MEETING,
    GET_ADMIN_MEETING_SUCCESS,
    GET_ADMIN_MEETING_ERROR,
    NEW_ADMIN_MEETING,
    NEW_ADMIN_MEETING_SUCCESS,
    NEW_ADMIN_MEETING_FAILURE,
    UPDATE_ADMIN_MEETING,
    UPDATE_ADMIN_MEETING_SUCCESS,
    UPDATE_ADMIN_MEETING_FAILURE,
    GET_STARTED_CONTENT,
    GET_STARTED_CONTENT_SUCCESS,
    GET_STARTED_CONTENT_ERROR,

} from "./actionTypes"

export const getAdminMeeting = () => {
    return {
        type: GET_ADMIN_MEETING,
    }
}

export const getAdminMeetingSuccess = meeting => {
    return {
        type: GET_ADMIN_MEETING_SUCCESS,
        payload: meeting,
    }
}

export const getAdminMeetingError = error => {
    return {
        type: GET_ADMIN_MEETING_ERROR,
        payload: error,
    }
}

export const newAdminMeeting = data => {
    return {
        type: NEW_ADMIN_MEETING,
        payload: data,
    }
}

export const newAdminMeetingSuccess = data => {
    return {
        type: NEW_ADMIN_MEETING_SUCCESS,
        payload: data,
    }
}

export const newAdminMeetingFailure = error => {
    return {
        type: NEW_ADMIN_MEETING_FAILURE,
        payload: error,
    }
}

export const updateAdminMeeting = ({ id, action, data }) => {
    return {
        type: UPDATE_ADMIN_MEETING,
        payload: { id, action, data },
    }
}

export const updateAdminMeetingSuccess = (data) => {
    return {
        type: UPDATE_ADMIN_MEETING_SUCCESS,
        payload: data,
    }
}

export const updateAdminMeetingFailure = (error) => {
    return {
        type: UPDATE_ADMIN_MEETING_FAILURE,
        payload: error,
    }
}

export const getStartedContent = () => {
    return {
        type: GET_STARTED_CONTENT,
    }
}

export const getStartedContentSuccess = data => {
    return {
        type: GET_STARTED_CONTENT_SUCCESS,
        payload: data,
    }
}

export const getStartedContentError = error => {
    return {
        type: GET_STARTED_CONTENT_ERROR,
        payload: error,
    }
}