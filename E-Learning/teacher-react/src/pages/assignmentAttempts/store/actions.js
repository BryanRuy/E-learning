
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

export const getAssignmentAttempts = ({ studentId, assignmentId }) => {
    return {
        type: GET_ASSIGNMENT_ATTEMPTS,
        payload: { studentId, assignmentId }
    }
}

export const getAssignmentAttemptsSuccess = (assignmentAttempts) => {
    return {
        type: GET_ASSIGNMENT_ATTEMPTS_SUCCESS,
        payload: assignmentAttempts
    }
}

export const getAssignmentAttemptsFailure = (error) => {
    return {
        type: GET_ASSIGNMENT_ATTEMPTS_FAILURE,
        payload: error
    }
}


export const getAssignmentAttemptDetail = (assignmentAttemptId) => {
    return {
        type: GET_ASSIGNMENT_ATTEMPT_DETAIL,
        payload: { assignmentAttemptId }
    }
}

export const getAssignmentAttemptDetailSuccess = (assignmentAttempt) => {
    return {
        type: GET_ASSIGNMENT_ATTEMPT_DETAIL_SUCCESS,
        payload: assignmentAttempt
    }
}

export const getAssignmentAttemptDetailFailure = (error) => {
    return {
        type: GET_ASSIGNMENT_ATTEMPT_DETAIL_FAILURE,
        payload: error
    }
}


export const getAssignmentDetail = (assignmentId) => {
    return {
        type: GET_ASSIGNMENT_DETAIL,
        payload: { assignmentId }
    }
}

export const getAssignmentDetailSuccess = (assignment) => {
    return {
        type: GET_ASSIGNMENT_DETAIL_SUCCESS,
        payload: assignment
    }
}

export const getAssignmentDetailFailure = (error) => {
    return {
        type: GET_ASSIGNMENT_DETAIL_FAILURE,
        payload: error
    }
}






