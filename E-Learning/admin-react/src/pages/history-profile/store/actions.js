import {
    GET_TEACHER_HISTORY_STATS,
    GET_TEACHER_HISTORY_STATS_SUCCESS,
    GET_TEACHER_HISTORY_STATS_FAILURE,

    GET_STUDENT_HISTORY_STATS,
    GET_STUDENT_HISTORY_STATS_SUCCESS,
    GET_STUDENT_HISTORY_STATS_FAILURE,

    GET_TEACHER_PAYMENT_PLAN,
    GET_TEACHER_PAYMENT_PLAN_SUCCESS,
    GET_TEACHER_PAYMENT_PLAN_FAILURE,

    POST_TEACHER_PAYMENT_PLAN,
    POST_TEACHER_PAYMENT_PLAN_SUCCESS,
    POST_TEACHER_PAYMENT_PLAN_FAILURE,

    UPDATE_TEACHER_PAYMENT_PLAN,
    UPDATE_TEACHER_PAYMENT_PLAN_SUCCESS,
    UPDATE_TEACHER_PAYMENT_PLAN_FAILURE
} from './actionTypes'


export const getTeacherHistoryStats = (teacherId) => {
    return {
        type: GET_TEACHER_HISTORY_STATS,
        payload: { teacherId }
    }
}

export const getTeacherHistoryStatsSuccess = (data) => {
    return {
        type: GET_TEACHER_HISTORY_STATS_SUCCESS,
        payload: data
    }
}

export const getTeacherHistoryStatsFailure = (error) => {
    return {
        type: GET_TEACHER_HISTORY_STATS_FAILURE,
        payload: error
    }
}

export const getStudentHistoryStats = (studentId) => {
    return {
        type: GET_STUDENT_HISTORY_STATS,
        payload: { studentId }
    }
}

export const getStudentHistoryStatsSuccess = (data) => {
    return {
        type: GET_STUDENT_HISTORY_STATS_SUCCESS,
        payload: data
    }
}

export const getStudentHistoryStatsFailure = (error) => {
    return {
        type: GET_STUDENT_HISTORY_STATS_FAILURE,
        payload: error
    }
}

export const getTeacherPaymentPlan = (teacherId) => {
    return {
        type:GET_TEACHER_PAYMENT_PLAN,
        payload:teacherId
    }
}

export const getTeacherPaymentPlanSuccess = (data) => {
    return {
        type:GET_TEACHER_PAYMENT_PLAN_SUCCESS,
        payload:data
    }
}

export const getTeacherPaymentPlanFailure = (error) => {
    return {
        type:GET_TEACHER_PAYMENT_PLAN_FAILURE,
        payload:error
    }
}


export const postTeacherPaymentPlan = (data) => {
    return {
        type:POST_TEACHER_PAYMENT_PLAN,
        payload:data
    }
}

export const postTeacherPaymentPlanSuccess = (data) => {
    return {
        type:POST_TEACHER_PAYMENT_PLAN_SUCCESS,
        payload:data
    }
}


export const postTeacherPaymentPlanFailure = (error) => {
    return {
        type:POST_TEACHER_PAYMENT_PLAN_FAILURE,
        payload:error
    }
}

export const updateTeacherPaymentPlan = (data) => {
    return {
        type:UPDATE_TEACHER_PAYMENT_PLAN,
        payload:data
    }
}

export const updateTeacherPaymentPlanSuccess = (data) => {
    return {
        type:UPDATE_TEACHER_PAYMENT_PLAN_SUCCESS,
        payload:data
    }
}


export const updateTeacherPaymentPlanFailure = (error) => {
    return {
        type:UPDATE_TEACHER_PAYMENT_PLAN_FAILURE,
        payload:error
    }
}





