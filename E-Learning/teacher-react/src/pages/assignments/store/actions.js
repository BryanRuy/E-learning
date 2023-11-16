import {
    GET_TEACHER_UPCOMING_ASSIGNMENTS,
    GET_TEACHER_UPCOMING_ASSIGNMENTS_SUCCESS,
    GET_TEACHER_UPCOMING_ASSIGNMENTS_FAILURE,

    GET_TEACHER_PAST_ASSIGNMENTS,
    GET_TEACHER_PAST_ASSIGNMENTS_SUCCESS,
    GET_TEACHER_PAST_ASSIGNMENTS_FAILURE,

    GET_STUDENT_ASSIGNMENTS,
    GET_STUDENT_ASSIGNMENTS_SUCCESS,
    GET_STUDENT_ASSIGNMENTS_FAILURE,

    GET_TEACHER_ASSIGNMENTS,
    GET_TEACHER_ASSIGNMENTS_SUCCESS,
    GET_TEACHER_ASSIGNMENTS_FAILURE,

    POST_ASSIGNMENT,
    POST_ASSIGNMENT_SUCCESS,
    POST_ASSIGNMENT_FAILURE,

    PUT_ASSIGNMENT,
    PUT_ASSIGNMENT_SUCCESS,
    PUT_ASSIGNMENT_FAILURE,

    ASSIGN_ASSIGNMENT,
    ASSIGN_ASSIGNMENT_SUCCESS,
    ASSIGN_ASSIGNMENT_FAILURE,

    GET_ASSIGNMENT_PAST_STUDENT,
    GET_ASSIGNMENT_PAST_STUDENT_SUCCESS,
    GET_ASSIGNMENT_PAST_STUDENT_FAILURE,

    GET_ASSIGNMENT_UPCOMING_STUDENT,
    GET_ASSIGNMENT_UPCOMING_STUDENT_SUCCESS,
    GET_ASSIGNMENT_UPCOMING_STUDENT_FAILURE,

    UNASSIGN_ASSIGNMENT,
    UNASSIGN_ASSIGNMENT_SUCCESS,
    UNASSIGN_ASSIGNMENT_FAILURE,
} from './actionTypes'

export const getTeacherUpcomingAssignments = () => {
    return {
        type: GET_TEACHER_UPCOMING_ASSIGNMENTS,
    }
}

export const getTeacherUpcomingAssignmentsSuccess = (data) => {
    return {
        type: GET_TEACHER_UPCOMING_ASSIGNMENTS_SUCCESS,
        payload: data
    }
}

export const getTeacherUpcomingAssignmentsFailure = (error) => {
    return {
        type: GET_TEACHER_UPCOMING_ASSIGNMENTS_FAILURE,
        payload: error
    }
}

export const getTeacherPastAssignments = () => {
    return {
        type: GET_TEACHER_PAST_ASSIGNMENTS,
    }
}

export const getTeacherPastAssignmentsSuccess = (data) => {
    return {
        type: GET_TEACHER_PAST_ASSIGNMENTS_SUCCESS,
        payload: data
    }
}

export const getTeacherPastAssignmentsFailure = (error) => {
    return {
        type: GET_TEACHER_PAST_ASSIGNMENTS_FAILURE,
        payload: error
    }
}

export const getStudentAssignments = (studentId) => {
    return {
        type: GET_STUDENT_ASSIGNMENTS,
        payload: studentId
    }
}

export const getStudentAssignmentsSuccess = (assignments) => {
    return {
        type: GET_STUDENT_ASSIGNMENTS_SUCCESS,
        payload: assignments
    }
}

export const getStudentAssignmentsFailure = (error) => {
    return {
        type: GET_STUDENT_ASSIGNMENTS_FAILURE,
        payload: error
    }
}

export const getTeacherAssignments = (data) => {
    return {
        type: GET_TEACHER_ASSIGNMENTS,
        payload:data
    }
}

export const getTeacherAssignmentsSuccess = (assignments) => {
    return {
        type: GET_TEACHER_ASSIGNMENTS_SUCCESS,
        payload: assignments
    }
}

export const getTeacherAssignmentsFailure = (error) => {
    return {
        type: GET_TEACHER_ASSIGNMENTS_FAILURE,
        payload: error
    }
}

export const postAssignment = (assignment) => {
    return {
        type: POST_ASSIGNMENT,
        payload: { assignment }
    }
}

export const postAssignmentSuccess = (assignments) => {
    return {
        type: POST_ASSIGNMENT_SUCCESS,
        payload: assignments
    }
}

export const postAssignmentFailure = (error) => {
    return {
        type: POST_ASSIGNMENT_FAILURE,
        payload: error
    }
}

export const putAssignment = (assignment) => {
    return {
        type: PUT_ASSIGNMENT,
        payload: { assignment }
    }
}

export const putAssignmentSuccess = (assignment) => {
    return {
        type: PUT_ASSIGNMENT_SUCCESS,
        payload: assignment
    }
}

export const putAssignmentFailure = (error) => {
    return {
        type: PUT_ASSIGNMENT_FAILURE,
        payload: error
    }
}


export const assignAssignment = (data) => {
    return {
        type: ASSIGN_ASSIGNMENT,
        payload: { data }
    }
}

export const assignAssignmentSuccess = (assignments) => {
    return {
        type: ASSIGN_ASSIGNMENT_SUCCESS,
        payload: assignments
    }
}

export const assignAssignmentFailure = (error) => {
    return {
        type: ASSIGN_ASSIGNMENT_FAILURE,
        payload: error
    }
}



export const getAssignmentPastStudent = (assignmentId) => {
    return {
        type: GET_ASSIGNMENT_PAST_STUDENT,
        payload: assignmentId
    }
}

export const getAssignmentPastStudentSuccess = (users) => {
    return {
        type: GET_ASSIGNMENT_PAST_STUDENT_SUCCESS,
        payload: users
    }
}

export const getAssignmentPastStudentFailure = (error) => {
    return {
        type: GET_ASSIGNMENT_PAST_STUDENT_FAILURE,
        payload: error
    }
}


export const getAssignmentUpcomingStudent = (assignmentId) => {
    return {
        type: GET_ASSIGNMENT_UPCOMING_STUDENT,
        payload: assignmentId
    }
}

export const getAssignmentUpcomingStudentSuccess = (users) => {
    return {
        type: GET_ASSIGNMENT_UPCOMING_STUDENT_SUCCESS,
        payload: users
    }
}

export const getAssignmentUpcomingStudentFailure = (error) => {
    return {
        type: GET_ASSIGNMENT_UPCOMING_STUDENT_FAILURE,
        payload: error
    }
}


export const unassignAssignment = (data) => {
    return {
        type: UNASSIGN_ASSIGNMENT,
        payload: { data }
    }
}

export const unassignAssignmentSuccess = (msg) => {
    return {
        type: UNASSIGN_ASSIGNMENT_SUCCESS,
        payload: msg
    }
}

export const unassignAssignmentFailure = (error) => {
    return {
        type: UNASSIGN_ASSIGNMENT_FAILURE,
        payload: error
    }
}










