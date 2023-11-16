import {
    REGISTER_ACCOUNT,
    REGISTER_ACCOUNT_SUCCESS,
    REGISTER_ACCOUNT_FAILURE,
} from "./actionTypes"

const initialState = {
    error: null,
    loading: false,
}

const registerReducer = (state = initialState, action) => {
    switch (action.type) {

        case REGISTER_ACCOUNT:
            return { ...state, error: null, loading: true }

        case REGISTER_ACCOUNT_SUCCESS:
            return { ...state, error: null, loading: false }

        case REGISTER_ACCOUNT_FAILURE:
            return { ...state, error: action.payload, loading: false }

        default:
            return state
    }
}

export default registerReducer
