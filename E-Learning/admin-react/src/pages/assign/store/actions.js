import {
    POST_ASSIGN_TEACHER,
    POST_ASSIGN_TEACHER_SUCCESS,
    POST_ASSIGN_TEACHER_FAILURE,

    UNASSIGN_TEACHER,
    UNASSIGN_TEACHER_SUCCESS,
    UNASSIGN_TEACHER_FAILURE,
} from './actionTypes'

export const postAssignTeacher = (data) => {
    return {
        type:POST_ASSIGN_TEACHER,
        payload:{data}
    }
}

export const postAssignTeacherSuccess = (data) => {
    return {
        type:POST_ASSIGN_TEACHER_SUCCESS,
        payload:data
    }
}

export const postAssignTeacherFailure = (error) => {
    return {
        type:POST_ASSIGN_TEACHER_FAILURE,
        payload:error
    }
}

export const unassignTeacher = (data) => {
    return {
        type:UNASSIGN_TEACHER,
        payload:{data}
    }
}

export const unassignTeacherSuccess = (data) => {
    return {
        type:UNASSIGN_TEACHER_SUCCESS,
        payload:data
    }
}

export const unassignTeacherFailure = (error) => {
    return {
        type:UNASSIGN_TEACHER_FAILURE,
        payload:error
    }
}

