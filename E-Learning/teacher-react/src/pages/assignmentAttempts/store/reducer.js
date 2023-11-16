import { string } from 'prop-types';
import {
    GET_ASSIGNMENT_ATTEMPTS,
    GET_ASSIGNMENT_ATTEMPTS_SUCCESS,
    GET_ASSIGNMENT_ATTEMPTS_FAILURE,

    GET_ASSIGNMENT_ATTEMPT_DETAIL,
    GET_ASSIGNMENT_ATTEMPT_DETAIL_SUCCESS,
    GET_ASSIGNMENT_ATTEMPT_DETAIL_FAILURE,

    GET_ASSIGNMENT_DETAIL,
    GET_ASSIGNMENT_DETAIL_SUCCESS,
    GET_ASSIGNMENT_DETAIL_FAILURE,

} from './actionTypes'

const initialState = {
    assignmentAttempts: [],
    assignmentAttemptsLoading: false,
    assignmentAttemptsError: null,

    assignmentAttemptDetail: {},
    assignmentAttemptDetailLoading: false,
    assignmentAttemptDetailError: null,

    assignmentDetail: {},
    assignmentDetailLoading: false,
    assignmentDetailError: null,

}

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_ASSIGNMENT_ATTEMPTS:
            state = {
                ...state,
                attemptsLoading: true,
            }
            break;
        case GET_ASSIGNMENT_ATTEMPTS_SUCCESS:
            state = {
                ...state,
                assignmentAttempts: action.payload,
                attemptsLoading: false,
            }
            break;
        case GET_ASSIGNMENT_ATTEMPTS_FAILURE:
            state = {
                ...state,
                attemptsLoading: false,
                attemptsError: action.payload,
            }
            break;
        case GET_ASSIGNMENT_ATTEMPT_DETAIL:
            state = {
                ...state,
                assignmentAttemptDetailLoading: true
            }
            break;
        case GET_ASSIGNMENT_ATTEMPT_DETAIL_SUCCESS:
            state = {
                ...state,
                assignmentAttemptDetail: action.payload,
                assignmentAttemptDetailLoading: false,
            }
            break;
        case GET_ASSIGNMENT_ATTEMPT_DETAIL_FAILURE:
            state = {
                ...state,
                assignmentAttemptDetailLoading: false,
                assignmentAttemptDetailError: action.payload,
            }
            break;
        case GET_ASSIGNMENT_DETAIL:
            state = {
                ...state,
                assignmentDetailLoading: true
            }
            break;
        case GET_ASSIGNMENT_DETAIL_SUCCESS:
            state = {
                ...state,
                assignmentDetail: action.payload,
                assignmentAttemptDetailLoading: false
            }
            break;
        case GET_ASSIGNMENT_DETAIL_FAILURE:
            state = {
                ...state,
                assignmentDetailLoading: false,
                assignmentDetailError: action.payload,
            }
            break;

        default:
            state = { ...state }
    }
    return state;
}
