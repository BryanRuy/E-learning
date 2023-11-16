import {
UPDATE_ADMIN_PROFILE,
UPDATE_ADMIN_PROFILE_SUCCESS,
UPDATE_ADMIN_PROFILE_FAILURE,

UPDATE_TEACHER_PROFILE,
UPDATE_TEACHER_PROFILE_SUCCESS,
UPDATE_TEACHER_PROFILE_FAILURE,

UPDATE_STUDENT_PROFILE,
UPDATE_STUDENT_PROFILE_SUCCESS,
UPDATE_STUDENT_PROFILE_FAILURE,

UPDATE_ADMIN_PROFILE_PICTURE,
UPDATE_ADMIN_PROFILE_PICTURE_SUCCESS,
UPDATE_ADMIN_PROFILE_PICTURE_FAILURE,

UPDATE_TEACHER_PROFILE_PICTURE,
UPDATE_TEACHER_PROFILE_PICTURE_SUCCESS,
UPDATE_TEACHER_PROFILE_PICTURE_FAILURE,

UPDATE_STUDENT_PROFILE_PICTURE,
UPDATE_STUDENT_PROFILE_PICTURE_SUCCESS,
UPDATE_STUDENT_PROFILE_PICTURE_FAILURE,

UPDATE_USER_PASSWORD,
UPDATE_USER_PASSWORD_SUCCESS,
UPDATE_USER_PASSWORD_FAILURE,
} from './actionsTypes'

export const updateAdminProfile = (data) => {
    return {
        type :UPDATE_ADMIN_PROFILE,
        payload: data
    }
}

export const updateAdminProfileSuccess = (data) => {
    return {
        type :UPDATE_ADMIN_PROFILE_SUCCESS,
        payload: data
    }
}

export const updateAdminProfileFailure = (error) => {
    return {
        type :UPDATE_ADMIN_PROFILE_FAILURE,
        payload: error
    }
}

export const updateTeacherProfile = (data) => {
    return {
        type :UPDATE_TEACHER_PROFILE,
        payload: data
    }
}

export const updateTeacherProfileSuccess = (data) => {
    return {
        type :UPDATE_TEACHER_PROFILE_SUCCESS,
        payload: data
    }
}

export const updateTeacherProfileFailure = (error) => {
    return {
        type :UPDATE_TEACHER_PROFILE_FAILURE,
        payload: error
    }
}

export const updateStudentProfile = (data) => {
    return {
        type :UPDATE_STUDENT_PROFILE,
        payload: data
    }
}

export const updateStudentProfileSuccess = (data) => {
    return {
        type :UPDATE_STUDENT_PROFILE_SUCCESS,
        payload: data
    }
}

export const updateStudentProfileFailure = (error) => {
    return {
        type :UPDATE_STUDENT_PROFILE_FAILURE,
        payload: error
    }
}

export const updateAdminProfilePicture = (userId,data)=>{
    return {
        type:UPDATE_ADMIN_PROFILE_PICTURE,
        payload:{userId, data}
    }
}
export const updateAdminProfilePictureSuccess = (data)=>{
    return {
        type:UPDATE_ADMIN_PROFILE_PICTURE_SUCCESS,
        payload:data
    }
}
export const updateAdminProfilePictureFailure = (error)=>{
    return {
        type:UPDATE_ADMIN_PROFILE_PICTURE_FAILURE,
        payload:error
    }
}

export const updateTeacherProfilePicture = (userId, data) => {
    return {
        type:UPDATE_TEACHER_PROFILE_PICTURE,
        payload:{userId, data}
    }
}
export const updateTeacherProfilePictureSuccess = (data) => { 
    return {
        type:UPDATE_TEACHER_PROFILE_PICTURE_SUCCESS,
        payload:data
    }
}
export const updateTeacherProfilePictureFailure = (error) => {
    return {
        type:UPDATE_TEACHER_PROFILE_PICTURE_FAILURE,
        payload:error
    }
}

export const updateStudentProfilePicture = (userId, data) => {
    return {
        type:UPDATE_STUDENT_PROFILE_PICTURE,
        payload:{userId, data}
    }
}
export const updateStudentProfilePictureSuccess = (data)=>{
    return {
        type:UPDATE_STUDENT_PROFILE_PICTURE_SUCCESS,
        payload:data
    }
}
export const updateStudentProfilePictureFailure = (error)=>{
    return {
        type:UPDATE_STUDENT_PROFILE_PICTURE_FAILURE,
        payload:error
    }
}

export const updateUserPassword = (data) => {
    return {
        type:UPDATE_USER_PASSWORD,
        payload:data
    }
}

export const updateUserPasswordSuccess = (data) => {
    return {
        type:UPDATE_USER_PASSWORD_SUCCESS,
        payload:data
    }
}

export const updateUserPasswordFailure = (error) => {
    return {
        type:UPDATE_USER_PASSWORD_FAILURE,
        payload:error
    }
}