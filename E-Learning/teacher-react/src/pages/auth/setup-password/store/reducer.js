import {
    SETUP_ACCOUNT_PASSWORD,
    SETUP_ACCOUNT_PASSWORD_SUCCESS,
    SETUP_ACCOUNT_PASSWORD_FAILURE,
} from "./actionTypes"

const initialState = {
    error: null,
    loading: false,
}

const setupPasswordReducer = (state = initialState, action) => {
    switch (action.type) {

        case SETUP_ACCOUNT_PASSWORD:
            return { ...state, error: null, loading: true }

        case SETUP_ACCOUNT_PASSWORD_SUCCESS:
            return { ...state, error: null, loading: false }

        case SETUP_ACCOUNT_PASSWORD_FAILURE:
            return { ...state, error: action.payload, loading: false }

        default:
            return state
    }
}

export default setupPasswordReducer
