import {
    GET_STUDENTS_STATS,
    GET_STUDENTS_STATS_SUCCESS,
    GET_STUDENTS_STATS_FAILURE,

    GET_STUDENT_DETAILS,
    GET_STUDENT_DETAILS_SUCCESS,
    GET_STUDENT_DETAILS_FAILURE,

    GET_ALL_STUDENTS,
    GET_ALL_STUDENTS_SUCCESS,
    GET_ALL_STUDENTS_FAILURE,

    GET_STUDENT_NEW_OR_WAITING_STATUS,
    GET_STUDENT_NEW_OR_WAITING_STATUS_SUCCESS,
    GET_STUDENT_NEW_OR_WAITING_STATUS_FAILURE,

    ON_SEARCH_CHANGE,
    
    GET_ACTIVE_STUDENTS,
    GET_ACTIVE_STUDENTS_SUCCESS,
    GET_ACTIVE_STUDENTS_FAILURE,
} from "./actionTypes"

const initialState = {
    studentListData: {},
    studentStats: {},
    studentStatsError: null,
    studentStatsLoading: false,

    student: {},
    studentLoading: false,
    studentError: null,

    allStudents: [],
    allStudentsLoading: false,
    allStudentsError: null,

    activeStudents: [],
    activeStudentsLoading: false,
    activeStudentsError: null,

    waitingOrNewStudentsListData: {},
    waitingOrNewStudents: [],
    waitingOrNewStudentsLoading: false,
    waitingOrNewStudentsError: null,
}

const studentsReducer = (state = initialState, action) => {
    switch (action.type) {

        case GET_STUDENTS_STATS:
            return { ...state, studentStatsLoading: true }

        case GET_STUDENTS_STATS_SUCCESS:
            return {
                ...state,
                studentStats: action.payload,
                studentListData: { ...state.studentListData, [1]: action.payload.students.data },
                studentStatsLoading: false
            }

        case GET_STUDENTS_STATS_FAILURE:
            return { ...state, studentStatsError: action.payload, studentStatsLoading: false }

        case GET_STUDENT_DETAILS:
            return { ...state, studentLoading: true }

        case GET_STUDENT_DETAILS_SUCCESS:
            return { ...state, student: action.payload, studentLoading: false }

        case GET_STUDENT_DETAILS_FAILURE:
            return { ...state, studentError: action.payload, studentLoading: false }

        case GET_ALL_STUDENTS:
            return { ...state, allStudentsLoading: true }

        case GET_ALL_STUDENTS_SUCCESS:
            return {
                ...state,
                allStudents: action.payload.res,
                studentListData: { ...state.studentListData, [action.payload.page]: action.payload.res.data },
                allStudentsLoading: false
            }

        case GET_ALL_STUDENTS_FAILURE:
            return { ...state, allStudentsError: action.payload, allStudentsLoading: false }

        case GET_STUDENT_NEW_OR_WAITING_STATUS:
            return { ...state, waitingOrNewStudentsLoading: true }

        case GET_STUDENT_NEW_OR_WAITING_STATUS_SUCCESS:
            return {
                ...state,
                waitingOrNewStudentsListData: { ...state.waitingOrNewStudentsListData, [action.payload.page]: action.payload.res.data },
                waitingOrNewStudents: action.payload.res,
                waitingOrNewStudentsLoading: false
            }

        case GET_STUDENT_NEW_OR_WAITING_STATUS_FAILURE:
            return { ...state, waitingOrNewStudentsError: action.payload, waitingOrNewStudentsLoading: false }

        case ON_SEARCH_CHANGE: {
            return {
                ...state, waitingOrNewStudentsListData: {},
                waitingOrNewStudents: [],
                allStudents: [],
                studentListData: {}
            }
        }

        case GET_ACTIVE_STUDENTS:
            return { ...state, activeStudentsLoading: true }

        case GET_ACTIVE_STUDENTS_SUCCESS:
            return {
                ...state,
                studentListData: { ...state.studentListData, [action.payload.page]: action.payload.res.data },
                activeStudents: action.payload.res,
                activeStudentsLoading: false
            }
        case GET_ACTIVE_STUDENTS_FAILURE:
            return {
                ...state,
                activeStudentsError: action.payload,
                activeStudentsLoading: false
            }

        default:
            return state
    }
}

export default studentsReducer
