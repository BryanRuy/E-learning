import { string } from 'prop-types';
import {
    GET_TEST_ATTEMPTS,
    GET_TEST_ATTEMPTS_SUCCESS,
    GET_TEST_ATTEMPTS_FAILURE,
    GET_ATTEMPT_DETAIL,
    GET_ATTEMPT_DETAIL_SUCCESS,
    GET_ATTEMPT_DETAIL_FAILURE,
    GET_TEST_DETAIL,
    GET_TEST_DETAIL_SUCCESS,
    GET_TEST_DETAIL_FAILURE,

    PUT_SUBJECTIVE_ATTEMPT_MARKS,
    PUT_SUBJECTIVE_ATTEMPT_MARKS_SUCCESS,
    PUT_SUBJECTIVE_ATTEMPT_MARKS_FAILURE,
} from './actionTypes'

const initialState = {
    attempts: [],
    attemptsLoading: false,
    attemptsError: null,
    attemptDetail: {},
    attemptDetailLoading: false,
    attemptDetailError: null,
    testDetail: {},
    testDetailLoading: false,
    testDetailError: null,

    updateAttempt: {},
    updateAttemptSuccess: false,
    updateAttemptLoading: false,
    updateAttemptError: null,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_TEST_ATTEMPTS:
            state = {
                ...state,
                attemptsLoading: true,
                attemptsError: null
            }
            break;
        case GET_TEST_ATTEMPTS_SUCCESS:
            state = {
                ...state,
                attempts: action.payload,
                attemptsLoading: false,
                attemptsError: null,
            }
            break;
        case GET_TEST_ATTEMPTS_FAILURE:
            state = {
                ...state,
                attemptsLoading: false,
                attemptsError: action.payload,
            }
            break;
        case GET_ATTEMPT_DETAIL:
            state = {
                ...state,
                attemptDetailLoading: true,
                attemptDetailError: null
            }
            break;
        case GET_ATTEMPT_DETAIL_SUCCESS:
            state = {
                ...state,
                attemptDetail: action.payload,
                attemptDetailLoading: false,
                attemptDetailError: null,
            }
            break;
        case GET_ATTEMPT_DETAIL_FAILURE:
            state = {
                ...state,
                attemptDetailLoading: false,
                attemptDetailError: action.payload,
            }
            break;
        case GET_TEST_DETAIL:
            state = {
                ...state,
                testDetailLoading: true,
                testDetailError: null
            }
            break;
        case GET_TEST_DETAIL_SUCCESS:
            state = {
                ...state,
                testDetail: action.payload,
                attemptDetailLoading: false,
                attemptDetailError: null,
            }
            break;
        case GET_TEST_DETAIL_FAILURE:
            state = {
                ...state,
                testDetailLoading: false,
                testDetailError: action.payload,
            }
            break;
        case PUT_SUBJECTIVE_ATTEMPT_MARKS:
            state = {
                ...state,
                updateAttemptLoading: true,
                updateAttemptError: null
            }
            break;
        case PUT_SUBJECTIVE_ATTEMPT_MARKS_SUCCESS:
            state = {
                ...state,
                updateAttempt: action.payload,
                updateAttemptSuccess: true,
                updateAttemptLoading: false,
                updateAttemptError: null
            }
            break;
        case PUT_SUBJECTIVE_ATTEMPT_MARKS_FAILURE:
            state = {
                ...state,
                updateAttemptLoading: false,
                updateAttemptError: action.payload
            }
            break;
        default:
            state = { ...state }
    }
    return state;
}
