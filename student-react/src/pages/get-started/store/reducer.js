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

} from './actionTypes'

const initialState = {
    meeting: {},
    meetingLoading: false,
    meetingError: null,
    newMeetingLoading: false,
    newMeetingError: null,
    updateMeetingLoading: false,
    updateMeetingError: null,
    content: null,
    contentLoading: false,
    contentError: null
}


export default (state = initialState, action) => {
    switch (action.type) {
        case GET_ADMIN_MEETING:
            state = {
                ...state,
                meetingLoading: true,
                meetingError: null
            }
            break;
        case GET_ADMIN_MEETING_SUCCESS:
            state = {
                ...state,
                meeting: action.payload,
                meetingLoading: false,
                meetingError: null,
            }
            break;
        case GET_ADMIN_MEETING_ERROR:
            state = {
                ...state,
                meeting: {},
                meetingLoading: false,
                meetingError: action.payload,
            }
            break;

        case NEW_ADMIN_MEETING:
            state = {
                ...state,
                newMeetingLoading: true,
                newMeetingError: null,
                meetingError: null
            }
            break;
        case NEW_ADMIN_MEETING_FAILURE:
            state = {
                ...state,
                newMeetingLoading: false,
                newMeetingError: action.payload
            }
            break;
        case NEW_ADMIN_MEETING_SUCCESS:
            state = {
                ...state,
                newMeetingLoading: false,
                meeting: action.payload,
            }
            break;
        case UPDATE_ADMIN_MEETING:
            state = {
                ...state,
                updateMeetingLoading: true,
                updateMeetingError: null,
            }
            break;
        case UPDATE_ADMIN_MEETING_SUCCESS:
            state = {
                ...state,
                meeting: action.payload,
                updateMeetingLoading: false,
                updateMeetingError: null,
            }
            break;
        case UPDATE_ADMIN_MEETING_FAILURE:
            state = {
                ...state,
                updateMeetingLoading: false,
                updateMeetingError: action.payload,
            }
            break;
        case GET_STARTED_CONTENT:
            state = {
                ...state,
                contentLoading: true,
            }
            break;
        case GET_STARTED_CONTENT_SUCCESS:

            state = {
                ...state,
                content: action.payload,
                contentLoading: false,
            }
            break;
        case GET_STARTED_CONTENT_ERROR:
            state = {
                ...state,
                content: null,
                contentLoading: false,
                contentError: action.payload,
            }
            break;

        default:
            state = { ...state }
    }
    return state;
}
