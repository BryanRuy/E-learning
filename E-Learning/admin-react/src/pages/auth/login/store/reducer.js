import {
    LOGIN_USER,
    LOGIN_SUCCESS,
    LOGOUT_USER,
    LOGOUT_USER_SUCCESS,
    LOGIN_ERROR,
} from "./actionTypes"

const initialState = {
    error: "",
    success: false,
    user: {},
    loading: false,
}

const login = (state = initialState, action) => {
    switch (action.type) {

        case LOGIN_USER:
            state = {
                ...state,
                loading: true,
                error: "",
                success: false
            }
            break;
        
        case LOGIN_SUCCESS:
            state = {
                ...state,
                success: true,
                user: action.payload,
                loading: false,
            }
            break
        case LOGIN_ERROR:
            state = {
                ...state,
                error: action.payload,
                success: false,
                loading: false,
                user: {}
            }
            break;
        
        case LOGOUT_USER:
            state = { ...state }
            break
        case LOGOUT_USER_SUCCESS:
            state = { ...state }
            break
        
        default:
            state = { ...state }
            break
    }
    return state
}

export default login
