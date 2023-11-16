import {
    GET_DASHBOARD_DATA,
    GET_DASHBOARD_DATA_SUCCESS,
    GET_DASHBOARD_DATA_FAILURE,
} from "./actionTypes"

const initialState = {
    data: {},
    error: null,
    loading: false,
}

const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {

        case GET_DASHBOARD_DATA:
            return { ...state, error: null, loading: true }

        case GET_DASHBOARD_DATA_SUCCESS:
            return { ...state, data: action.payload, error: null, loading: false }

        case GET_DASHBOARD_DATA_FAILURE:
            return { ...state, data: {}, error: action.payload, loading: false }

        default:
            return state
    }
}

export default dashboardReducer
