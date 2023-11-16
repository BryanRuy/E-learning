import {
    GET_ALL_MEETINGS,
    GET_ALL_MEETINGS_SUCCESS,
    GET_ALL_MEETINGS_ERROR,
    GET_MEETING_DATES,
    GET_MEETING_DATES_SUCCESS,
    GET_MEETING_DATES_FAILURE,
    NEW_MEETING,
    NEW_MEETING_SUCCESS,
    NEW_MEETING_FAILURE,
    UPDATE_MEETING,
    UPDATE_MEETING_SUCCESS,
    UPDATE_MEETING_FAILURE,
    GET_STUDENTS_FOR_MEETING,
    GET_STUDENTS_FOR_MEETING_SUCCESS,
    GET_STUDENTS_FOR_MEETING_FAILURE,
    GET_MEETING_TOKEN,
    GET_MEETING_TOKEN_SUCCESS,
    GET_MEETING_TOKEN_FAILURE,

} from "./actionTypes"

export const getAllMeetings = (data) => {
    return {
        type: GET_ALL_MEETINGS,
        payload:data
    }
}

export const getAllMeetingsSuccess = meetings => {
    return {
        type: GET_ALL_MEETINGS_SUCCESS,
        payload: meetings,
    }
}

export const getAllMeetingsError = error => {
    return {
        type: GET_ALL_MEETINGS_ERROR,
        payload: error,
    }
}

export const getMeetingDates = id => {
    return {
        type: GET_MEETING_DATES,
        payload: id,
    }
}

export const getMeetingDatesSuccess = data => {
    return {
        type: GET_MEETING_DATES_SUCCESS,
        payload: data,
    }
}

export const getMeetingDatesFailure = error => {
    return {
        type: GET_MEETING_DATES_FAILURE,
        payload: error,
    }
}

export const newMeeting = data => {
    return {
        type: NEW_MEETING,
        payload: data,
    }
}

export const newMeetingSuccess = data => {
    return {
        type: NEW_MEETING_SUCCESS,
        payload: data,
    }
}

export const newMeetingFailure = error => {
    return {
        type: NEW_MEETING_FAILURE,
        payload: error,
    }
}

export const updateMeeting = ({ id, action, data }) => {
    return {
        type: UPDATE_MEETING,
        payload: { id, action, data },
    }
}

export const updateMeetingSuccess = ({ id, data }) => {
    return {
        type: UPDATE_MEETING_SUCCESS,
        payload: { id, data },
    }
}

export const updateMeetingFailure = ({ id, error }) => {
    return {
        type: UPDATE_MEETING_FAILURE,
        payload: { id, error },
    }
}

export const getStudentsForMeeting = (data) => {
    return {
        type: GET_STUDENTS_FOR_MEETING,
        payload:data
    }
}

export const getStudentsForMeetingSuccess = (data) => {
    return {
        type: GET_STUDENTS_FOR_MEETING_SUCCESS,
        payload: data
    }
}

export const getStudentsForMeetingFailure = (error) => {
    return {
        type: GET_STUDENTS_FOR_MEETING_FAILURE,
        payload: error
    }
}

export const getMeetingToken = () => {
    return {
        type: GET_MEETING_TOKEN,
    }
}

export const getMeetingTokenSuccess = (data) => {
    return {
        type: GET_MEETING_TOKEN_SUCCESS,
        payload: data
    }
}

export const getMeetingTokenFailure = (error) => {
    return {
        type: GET_MEETING_TOKEN_FAILURE,
        payload: error
    }
}