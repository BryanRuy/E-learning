import {
    FORGOT_ACCOUNT_PASSWORD,
    FORGOT_ACCOUNT_PASSWORD_SUCCESS,
    FORGOT_ACCOUNT_PASSWORD_FAILURE,
} from "./actionTypes"

const initialState = {
    error: null,
    loading: false,
}

const forgotPasswordReducer = (state = initialState, action) => {
    switch (action.type) {

        case FORGOT_ACCOUNT_PASSWORD:
            return { ...state, error: null, loading: true }

        case FORGOT_ACCOUNT_PASSWORD_SUCCESS:
            return { ...state, error: null, loading: false }

        case FORGOT_ACCOUNT_PASSWORD_FAILURE:
            return { ...state, error: action.payload, loading: false }

        default:
            return state
    }
}

export default forgotPasswordReducer
