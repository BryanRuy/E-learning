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

export const getTestAttempts = ({ studentId, testId }) => {
    return {
        type: GET_TEST_ATTEMPTS,
        payload: { studentId, testId }
    }
}

export const getTestAttemptsSuccess = (attempts) => {
    return {
        type: GET_TEST_ATTEMPTS_SUCCESS,
        payload: attempts
    }
}

export const getTestAttemptsFailure = (error) => {
    return {
        type: GET_TEST_ATTEMPTS_FAILURE,
        payload: error
    }
}


export const getAttemptDetail = (attemptId) => {
    return {
        type: GET_ATTEMPT_DETAIL,
        payload: { attemptId }
    }
}

export const getAttemptDetailSuccess = (attempt) => {
    return {
        type: GET_ATTEMPT_DETAIL_SUCCESS,
        payload: attempt
    }
}

export const getAttemptDetailFailure = (error) => {
    return {
        type: GET_ATTEMPT_DETAIL_FAILURE,
        payload: error
    }
}


export const getTestDetail = (testId) => {
    return {
        type: GET_TEST_DETAIL,
        payload: { testId }
    }
}

export const getTestDetailSuccess = (test) => {
    return {
        type: GET_TEST_DETAIL_SUCCESS,
        payload: test
    }
}

export const getTestDetailFailure = (error) => {
    return {
        type: GET_TEST_DETAIL_FAILURE,
        payload: error
    }
}

export const putSubjectiveAttemptMarks = (attemptId, data) => {
    return {
        type: PUT_SUBJECTIVE_ATTEMPT_MARKS,
        payload: { attemptId, data }
    }
}

export const putSubjectiveAttemptMarksSuccess = (data) => {
    return {
        type: PUT_SUBJECTIVE_ATTEMPT_MARKS_SUCCESS,
        payload: data
    }
}

export const putSubjectiveAttemptMarksFailure = (error) => {
    return {
        type: PUT_SUBJECTIVE_ATTEMPT_MARKS_FAILURE,
        payload: error
    }
}




