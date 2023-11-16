

import {
  GET_ADMINS,
  GET_ADMINS_SUCCESS,
  GET_ADMINS_FAILURE,
  GET_ADMIN_DETAIL,
  GET_ADMIN_DETAIL_SUCCESS,
  GET_ADMIN_DETAIL_FAILURE,
  REGISTER_ADMIN,
REGISTER_ADMIN_SUCCESS,
REGISTER_ADMIN_FAILURE,
} from "./actionsTypes";

export const getAdmins = (data) => {
  return {
    type: GET_ADMINS,
    payload:data
  }
}

export const getAdminsSuccess = (data) => {
  return {
    type: GET_ADMINS_SUCCESS,
    payload: data,
  }
}

export const getAdminsFailure = (error) => {
  return {
    type: GET_ADMINS_FAILURE,
    payload: error,
  }
}

export const getAdminDetail = (userId) => {
  return {
    type: GET_ADMIN_DETAIL,
    payload: userId,
  }
}

export const getAdminDetailSuccess = (data) => {
  return {
    type: GET_ADMIN_DETAIL_SUCCESS,
    payload: data,
  }
}

export const getAdminDetailFailure = (error) => {
  return {
    type: GET_ADMIN_DETAIL_FAILURE,
    payload: error,
  }
}

export const registerAdmin =(data)=>{
  return {
    type:REGISTER_ADMIN,
    payload:data
  }

}
export const registerAdminSuccess =(data)=>{
  return {
    type:REGISTER_ADMIN_SUCCESS,
    payload:data
  }

}
export const registerAdminFailure =(error)=>{
  return {
    type:REGISTER_ADMIN_FAILURE,
    payload:error
  }

}