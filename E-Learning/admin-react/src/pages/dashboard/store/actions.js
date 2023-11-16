import {
  GET_DASHBOARD_DATA,
  GET_DASHBOARD_DATA_SUCCESS,
  GET_DASHBOARD_DATA_FAILURE,

} from "./actionTypes"

export const getDashboardData = () => {
  return {
    type: GET_DASHBOARD_DATA,
  }
}

export const getDashboardDataSuccess = (data) => {
  return {
    type: GET_DASHBOARD_DATA_SUCCESS,
    payload: data,
  }
}

export const getDashboardDataFailure = (error) => {
  return {
    type: GET_DASHBOARD_DATA_FAILURE,
    payload: error,
  }
}