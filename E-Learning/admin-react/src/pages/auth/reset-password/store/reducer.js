import {
    RESET_ACCOUNT_PASSWORD,
    RESET_ACCOUNT_PASSWORD_SUCCESS,
    RESET_ACCOUNT_PASSWORD_FAILURE,
} from "./actionTypes"

const initialState = {
    error: null,
    loading: false,
}

const setupPasswordReducer = (state = initialState, action) => {
    switch (action.type) {

        case RESET_ACCOUNT_PASSWORD:
            return { ...state, error: null, loading: true }

        case RESET_ACCOUNT_PASSWORD_SUCCESS:
            return { ...state, error: null, loading: false }

        case RESET_ACCOUNT_PASSWORD_FAILURE:
            return { ...state, error: action.payload, loading: false }

        default:
            return state
    }
}

export default setupPasswordReducer
