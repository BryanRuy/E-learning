import {
    GET_STUDENTS,
    GET_STUDENTS_SUCCESS,
    GET_STUDENTS_FAILURE,
    GET_STUDENT_BY_ID,
    GET_STUDENT_BY_ID_SUCCESS,
    GET_STUDENT_BY_ID_FAILURE,
} from './actionTypes'

const initialState = {
    students: [],
    studentList:{},
    studentsLoading: false,
    studentsError: null,
    studentProfile: {},
}

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_STUDENTS:
            state = {
                ...state,
                studentsLoading: true,
                studentsError: null
            }
            break;
        case GET_STUDENTS_SUCCESS:
            state = {
                ...state,
                studentList:{...state.studentList,[action.payload.page]:action.payload.res.data},
                students: action.payload.res,
                studentsLoading: false,
                studentsError: null,
            }
            break;
        case GET_STUDENTS_FAILURE:
            state = {
                ...state,
                studentsLoading: false,
                studentsError: action.payload,
            }
            break;


        case GET_STUDENT_BY_ID:
            state = {
                ...state,
                studentsLoading: true,
                studentsError: null
            }
            break;
        case GET_STUDENT_BY_ID_SUCCESS:
            state = {
                ...state,
                studentProfile: action.payload,
                studentsLoading: false,
                studentsError: null,
            }
            break;
        case GET_STUDENT_BY_ID_FAILURE:
            state = {
                ...state,
                studentsLoading: false,
                studentsError: action.payload,
            }
            break;
        default:
            state = { ...state }
    }
    return state;
}
