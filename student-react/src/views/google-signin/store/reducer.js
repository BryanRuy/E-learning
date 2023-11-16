import {
    SIGN_IN_WITH_GOOGLE,
    SIGN_IN_WITH_GOOGLE_SUCCESS,
    SIGN_IN_WITH_GOOGLE_FAILURE,
} from "./actionTypes"

const initialState = {
    error: null,
    loading: false,
}

const signInWithGoogleReducer = (state = initialState, action) => {
    switch (action.type) {

        case SIGN_IN_WITH_GOOGLE:
            return { ...state, error: null, loading: true }

        case SIGN_IN_WITH_GOOGLE_SUCCESS:
            return {
                ...state,
                error: null,
                loading: false
            }

        case SIGN_IN_WITH_GOOGLE_FAILURE:
            return { ...state, error: action.payload, loading: false }

        default:
            return state
    }
}

export default signInWithGoogleReducer
